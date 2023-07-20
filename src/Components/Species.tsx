import { useEffect, useState } from 'react';
import { Container, ListGroup, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { ISpecie } from 'swapi-ts';

export function Species() {
  const [species, setSpecies] = useState<ISpecie[]>([]);
  const [selectedSpecie, setSelectedSpecie] = useState<ISpecie>();
  const [nextPageLink, setNextPageLink] = useState('');
  const [prevPageLink, setPrevPageLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    fetchSpeciesList('https://swapi.dev/api/species/?page=1')
      .then(list => {
        setSpecies(list);
        setIsLoading(false);
      });
  }, []);

  const fetchSpeciesList = async (url: string): Promise<ISpecie[]> => {
    const response = await fetch(url);
    const fullData = await response.json();
    const speciesList: ISpecie[] = fullData.results;
    fullData?.next ? setNextPageLink(fullData.next) : setNextPageLink('');
    fullData?.previous ? setPrevPageLink(fullData.next) : setPrevPageLink('');
    return speciesList;
  };

  const onSpeciesClick = (specie: ISpecie): void => {
    setSelectedSpecie(specie);
    setIsModalOpen(true);
  };

  const onPageClick = (url: string) => {
    setIsLoading(true);
    setSpecies([]);
    fetchSpeciesList(nextPageLink)
      .then(list => {
        setSpecies(list);
        setIsLoading(false);
      });
  };

  const handleModalClose = () => setIsModalOpen(false);

  const onSearch = async (input: string) => {
    setIsLoading(true);
    setSpecies([]);
    setNextPageLink('');
    setPrevPageLink('');
    if (input.length) {
      const response = await fetch(`https://swapi.dev/api/species/?search=${input}`);
      const fullData = await response.json();
      if (fullData.results.length > 0) {
        const speciesList: ISpecie[] = fullData.results;
        setSpecies(speciesList);
      }
      setIsLoading(false);
    } else {
      fetchSpeciesList('https://swapi.dev/api/species/?page=1')
        .then(list => {
          setSpecies(list);
          setIsLoading(false);
        });
    }
  };

  return (
    <Container className="py-3 text-light">
      <h1>Species</h1>
      <Container className="mt-3 mb-3">
        <Row>
          <Col xs={9}>
            <Form.Control type="text" placeholder="Search by species's name" onChange={val => setInputValue(val.target.value)}></Form.Control>
          </Col>
          <Col><Button variant="secondary" onClick={() => {onSearch(inputValue)}}>Search</Button></Col>
        </Row>
      </Container>
      { species.length ? 
        <div>
          <ListGroup as="ul">
            { species.map(specie => {
              return (
                <ListGroup.Item action key={specie.url} variant="dark" onClick={() => onSpeciesClick(specie)}>
                  <h2>{specie.name}</h2>
                </ ListGroup.Item>
              );
            }) }
          </ListGroup>
          <div className="mt-3">
            <span className="px-3">{ prevPageLink ? <Button onClick={() => onPageClick(prevPageLink)} variant="secondary">Previous Page</Button> : null }</span>
            { nextPageLink ? <Button variant="secondary" onClick={() => onPageClick(nextPageLink)}>Next Page</Button> : null }
          </div>
        </div> : 
        <div>{ isLoading ? 'Fetching species...' : 'No results found'}</div> 
      }

      <Modal show={isModalOpen} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedSpecie?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Designation: {selectedSpecie?.designation}</p>
          <p>Language: {selectedSpecie?.language}</p>
          <p>Classification: {selectedSpecie?.classification}</p>
          <p>Average Lifespan: {selectedSpecie?.average_lifespan}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

