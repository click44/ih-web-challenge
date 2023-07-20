import { useEffect, useState } from 'react';
import { Container, ListGroup, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { IVehicle } from 'swapi-ts';

export function Vehicles() {
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle>();
  const [nextPageLink, setNextPageLink] = useState('');
  const [prevPageLink, setPrevPageLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    fetchVehicleList('https://swapi.dev/api/vehicles/?page=1')
      .then(list => {
        setVehicles(list);
        setIsLoading(false);
      });
  }, []);

  const fetchVehicleList = async (url: string): Promise<IVehicle[]> => {
    const response = await fetch(url);
    const fullData = await response.json();
    const vehicleList: IVehicle[] = fullData.results;
    fullData?.next ? setNextPageLink(fullData.next) : setNextPageLink('');
    fullData?.previous ? setPrevPageLink(fullData.next) : setPrevPageLink('');
    return vehicleList;
  };

  const onVehicleClick = (vehicle: IVehicle): void => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const onPageClick = (url: string) => {
    setIsLoading(true);
    setVehicles([]);
    fetchVehicleList(nextPageLink)
      .then(list => {
        setVehicles(list);
        setIsLoading(false);
      });
  };

  const handleModalClose = () => setIsModalOpen(false);

  const onSearch = async (input: string) => {
    setIsLoading(true);
    setVehicles([]);
    setNextPageLink('');
    setPrevPageLink('');
    if (input.length) {
      const response = await fetch(`https://swapi.dev/api/vehicles/?search=${input}`);
      const fullData = await response.json();
      if (fullData.results.length > 0) {
        const vehicleList: IVehicle[] = fullData.results;
        setVehicles(vehicleList);
      }
      setIsLoading(false);
    } else {
      fetchVehicleList('https://swapi.dev/api/vehicles/?page=1')
        .then(list => {
          setVehicles(list);
          setIsLoading(false);
        });
    }
  };


  return (
    <Container className="py-3 text-light">
      <h1>Vehicles</h1>
      <Container className="mt-3 mb-3">
        <Row>
          <Col xs={9}>
            <Form.Control type="text" placeholder="Search by vehicles's name or model" onChange={val => setInputValue(val.target.value)}></Form.Control>
          </Col>
          <Col><Button variant="secondary" onClick={() => {onSearch(inputValue)}}>Search</Button></Col>
        </Row>
      </Container>
      { vehicles.length ? 
        <div>
          <ListGroup as="ul">
            { vehicles.map(vehicle => {
              return (
                <ListGroup.Item action key={vehicle.url} variant="dark" onClick={() => onVehicleClick(vehicle)}>
                  <h2>{vehicle.name}</h2>
                </ ListGroup.Item>
              );
            }) }
          </ListGroup>
          <div className="mt-3">
            <span className="px-3">{ prevPageLink ? <Button onClick={() => onPageClick(prevPageLink)} variant="secondary">Previous Page</Button> : null }</span>
            { nextPageLink ? <Button variant="secondary" onClick={() => onPageClick(nextPageLink)}>Next Page</Button> : null }
          </div>
        </div> : 
        <div>{ isLoading ? 'Fetching vehicles...' : 'No results found'}</div> 
      }

      <Modal show={isModalOpen} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedVehicle?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Model: {selectedVehicle?.model}</p>
          <p>Max Atmosphering Speed: {selectedVehicle?.max_atmosphering_speed}</p>
          <p>Manufacturer: {selectedVehicle?.manufacturer}</p>
          <p>Cost in Credits: {selectedVehicle?.cost_in_credits}</p>
          <p>Crew: {selectedVehicle?.crew}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

