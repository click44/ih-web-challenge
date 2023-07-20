import { useEffect, useState } from 'react';
import { Container, ListGroup, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { IPlanet } from 'swapi-ts';

export function Planets() {
  const [planets, setPlanets] = useState<IPlanet[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<IPlanet>();
  const [nextPageLink, setNextPageLink] = useState('');
  const [prevPageLink, setPrevPageLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    fetchPlanetList('https://swapi.dev/api/planets/?page=1')
      .then(list => {
        setPlanets(list);
        setIsLoading(false);
      });
  }, []);

  const fetchPlanetList = async (url: string): Promise<IPlanet[]> => {
    const response = await fetch(url);
    const fullData = await response.json();
    const planetList: IPlanet[] = fullData.results;
    fullData?.next ? setNextPageLink(fullData.next) : setNextPageLink('');
    fullData?.previous ? setPrevPageLink(fullData.next) : setPrevPageLink('');
    return planetList;
  };

  const onPlanetClick = (planet: IPlanet): void => {
    setSelectedPlanet(planet);
    setIsModalOpen(true);
  };

  const onPageClick = (url: string) => {
    setIsLoading(true);
    setPlanets([]);
    fetchPlanetList(nextPageLink)
      .then(list => {
        setPlanets(list);
        setIsLoading(false);
      });
  };

  const handleModalClose = () => setIsModalOpen(false);

  const onSearch = async (input: string) => {
    setIsLoading(true);
    setPlanets([]);
    setNextPageLink('');
    setPrevPageLink('');
    if (input.length) {
      const response = await fetch(`https://swapi.dev/api/planets/?search=${input}`);
      const fullData = await response.json();
      if (fullData.results.length > 0) {
        const planetList: IPlanet[] = fullData.results;
        setPlanets(planetList);
      }
      setIsLoading(false);
    } else {
      fetchPlanetList('https://swapi.dev/api/planets/?page=1')
        .then(list => {
          setPlanets(list);
          setIsLoading(false);
        });
    }
  };


  return (
    <Container className="py-3 text-light">
      <h1>Planets</h1>
      <Container className="mt-3 mb-3">
        <Row>
          <Col xs={9}>
            <Form.Control type="text" placeholder="Search by planet's name" onChange={val => setInputValue(val.target.value)}></Form.Control>
          </Col>
          <Col><Button variant="secondary" onClick={() => {onSearch(inputValue)}}>Search</Button></Col>
        </Row>
      </Container>
      { planets.length ? 
        <div>
          <ListGroup as="ul">
            { planets.map(planet => {
              return (
                <ListGroup.Item action key={planet.url} variant="dark" onClick={() => onPlanetClick(planet)}>
                  <h2>{planet.name}</h2>
                </ ListGroup.Item>
              );
            }) }
          </ListGroup>
          <div className="mt-3">
            <span className="px-3">{ prevPageLink ? <Button onClick={() => onPageClick(prevPageLink)} variant="secondary">Previous Page</Button> : null }</span>
            { nextPageLink ? <Button variant="secondary" onClick={() => onPageClick(nextPageLink)}>Next Page</Button> : null }
          </div>
        </div> : 
        <div>{ isLoading ? 'Fetching planets...' : 'No results found'}</div> 
      }

      <Modal show={isModalOpen} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPlanet?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Population: {selectedPlanet?.population}</p>
          <p>Climate: {selectedPlanet?.climate}</p>
          <p>Diameter: {selectedPlanet?.diameter}</p>
          <p>Orbital Period: {selectedPlanet?.orbital_period}</p>
          <p>Terrain: {selectedPlanet?.terrain}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

