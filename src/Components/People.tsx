import { useEffect, useState } from 'react';
import { Container, ListGroup, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { IPeople } from 'swapi-ts';

export function People() {
  const [people, setPeople] = useState<IPeople[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<IPeople>();
  const [nextPageLink, setNextPageLink] = useState('');
  const [prevPageLink, setPrevPageLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    fetchPeopleList('https://swapi.dev/api/people/?page=1')
      .then(list => {
        setPeople(list);
        setIsLoading(false);
      });
  }, []);

  const fetchPeopleList = async (url: string): Promise<IPeople[]> => {
    const response = await fetch(url);
    const fullData = await response.json();
    const peopleList: IPeople[] = fullData.results;
    fullData?.next ? setNextPageLink(fullData.next) : setNextPageLink('');
    fullData?.previous ? setPrevPageLink(fullData.next) : setPrevPageLink('');
    return peopleList;
  };

  const onPersonClick = (person: IPeople): void => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const onPageClick = (url: string) => {
    setIsLoading(true);
    setPeople([]);
    fetchPeopleList(nextPageLink)
      .then(list => {
        setPeople(list);
        setIsLoading(false);
      });
  };

  const handleModalClose = () => setIsModalOpen(false);

  const onSearch = async (input: string) => {
    setIsLoading(true);
    setPeople([]);
    setNextPageLink('');
    setPrevPageLink('');
    if (input.length) {
      const response = await fetch(`https://swapi.dev/api/people/?search=${input}`);
      const fullData = await response.json();
      if (fullData.results.length > 0) {
        const peopleList: IPeople[] = fullData.results;
        setPeople(peopleList);
      }
      setIsLoading(false);
    } else {
      fetchPeopleList('https://swapi.dev/api/people/?page=1')
        .then(list => {
          setPeople(list);
          setIsLoading(false);
        });
    }
  };

  return (
    <Container className="py-3 text-light">
      <h1>People</h1>
      <Container className="mt-3 mb-3">
        <Row>
          <Col xs={9}>
            <Form.Control type="text" placeholder="Search by person's name" onChange={val => setInputValue(val.target.value)}></Form.Control>
          </Col>
          <Col><Button variant="secondary" onClick={() => {onSearch(inputValue)}}>Search</Button></Col>
        </Row>
      </Container>
      { people.length ? 
        <div>
          <ListGroup as="ul">
            { people.map(person => {
              return (
                <ListGroup.Item action key={person.url} variant="dark" onClick={() => onPersonClick(person)}>
                  <h2>{person.name}</h2>
                </ ListGroup.Item>
              );
            }) }
          </ListGroup>
          <div className="mt-3">
            <span className="px-3">{ prevPageLink ? <Button onClick={() => onPageClick(prevPageLink)} variant="secondary">Previous Page</Button> : null }</span>
            { nextPageLink ? <Button variant="secondary" onClick={() => onPageClick(nextPageLink)}>Next Page</Button> : null }
          </div>
        </div> : 
        <div>{ isLoading ? 'Fetching people...' : 'No results found'}</div> 
      }

      <Modal show={isModalOpen} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPerson?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { selectedPerson?.birth_year ? (<p>Release Date: {`${selectedPerson.birth_year}`}</p>) : null }
          <p>Height: {selectedPerson?.height}</p>
          <p>Hair Color: {selectedPerson?.hair_color}</p>
          <p>Birth Year: {selectedPerson?.birth_year}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

