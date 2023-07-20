import { useEffect, useState } from 'react';
import { Container, ListGroup, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { IStarship } from 'swapi-ts';

export function Starships() {
  const [starships, setStarships] = useState<IStarship[]>([]);
  const [selectedStarship, setSelectedStarship] = useState<IStarship>();
  const [nextPageLink, setNextPageLink] = useState('');
  const [prevPageLink, setPrevPageLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    fetchStarshipList('https://swapi.dev/api/starships/?page=1')
      .then(list => {
        setStarships(list);
        setIsLoading(false);
      });
  }, []);

  const fetchStarshipList = async (url: string): Promise<IStarship[]> => {
    const response = await fetch(url);
    const fullData = await response.json();
    const starshipList: IStarship[] = fullData.results;
    fullData?.next ? setNextPageLink(fullData.next) : setNextPageLink('');
    fullData?.previous ? setPrevPageLink(fullData.next) : setPrevPageLink('');
    return starshipList;
  };

  const onStarshipClick = (starship: IStarship): void => {
    setSelectedStarship(starship);
    setIsModalOpen(true);
  };

  const onPageClick = (url: string) => {
    setIsLoading(true);
    setStarships([]);
    fetchStarshipList(nextPageLink)
      .then(list => {
        setStarships(list);
        setIsLoading(false);
      });
  };

  const handleModalClose = () => setIsModalOpen(false);

  const onSearch = async (input: string) => {
    setIsLoading(true);
    setStarships([]);
    setNextPageLink('');
    setPrevPageLink('');
    if (input.length) {
      const response = await fetch(`https://swapi.dev/api/starships/?search=${input}`);
      const fullData = await response.json();
      if (fullData.results.length > 0) {
        const starshipList: IStarship[] = fullData.results;
        setStarships(starshipList);
      }
      setIsLoading(false);
    } else {
      fetchStarshipList('https://swapi.dev/api/starships/?page=1')
        .then(list => {
          setStarships(list);
          setIsLoading(false);
        });
    }
  };


  return (
    <Container className="py-3 text-light">
      <h1>Starships</h1>
      <Container className="mt-3 mb-3">
        <Row>
          <Col xs={9}>
            <Form.Control type="text" placeholder="Search by starship's name or model" onChange={val => setInputValue(val.target.value)}></Form.Control>
          </Col>
          <Col><Button variant="secondary" onClick={() => {onSearch(inputValue)}}>Search</Button></Col>
        </Row>
      </Container>
      { starships.length ? 
        <div>
          <ListGroup as="ul">
            { starships.map(starship => {
              return (
                <ListGroup.Item action key={starship.url} variant="dark" onClick={() => onStarshipClick(starship)}>
                  <h2>{starship.name}</h2>
                </ ListGroup.Item>
              );
            }) }
          </ListGroup>
          <div className="mt-3">
            <span className="px-3">{ prevPageLink ? <Button onClick={() => onPageClick(prevPageLink)} variant="secondary">Previous Page</Button> : null }</span>
            { nextPageLink ? <Button variant="secondary" onClick={() => onPageClick(nextPageLink)}>Next Page</Button> : null }
          </div>
        </div> : 
        <div>{ isLoading ? 'Fetching starships...' : 'No results found'}</div> 
      }

      <Modal show={isModalOpen} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedStarship?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Model: {selectedStarship?.model}</p>
          <p>Hyperdrive Rating: {selectedStarship?.hyperdrive_rating}</p>
          <p>Manufacturer: {selectedStarship?.manufacturer}</p>
          <p>Cost in Credits: {selectedStarship?.cost_in_credits}</p>
          <p>Crew: {selectedStarship?.crew}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

