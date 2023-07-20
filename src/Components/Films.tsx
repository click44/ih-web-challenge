import { useEffect, useState } from 'react';
import { Container, ListGroup, Modal, Form, Button, Row, Col } from "react-bootstrap";
import { IFilm } from 'swapi-ts';

export function Films() {
  const [films, setFilms] = useState<IFilm[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<IFilm>();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    fetchFilmList()
      .then(list => {
        setFilms(list);
        setIsLoading(false);
      });
  }, []);

  const fetchFilmList = async (): Promise<IFilm[]> => {
    const response = await fetch(`https://swapi.dev/api/films`);
    const fullData = await response.json();
    const filmList: IFilm[] = fullData.results;
    return filmList;
  }

  const onFilmClick = (film: IFilm): void => {
    setSelectedFilm(film);
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  const onSearch = async (input: string) => {
    setIsLoading(true);
    setFilms([]);
    if (input.length) {
      const response = await fetch(`https://swapi.dev/api/films/?search=${input}`);
      const fullData = await response.json();
      if (fullData.results.length > 0) {
        const filmList: IFilm[] = fullData.results;
        setFilms(filmList);
      }
      setIsLoading(false);
    } else {
      fetchFilmList()
        .then(list => {
          setFilms(list);
          setIsLoading(false);
        });
    }
  };

  return (
    <Container className="py-3 text-light">
      <h1>Films</h1>
      <Container className="mt-3 mb-3">
        <Row>
          <Col xs={9}>
            <Form.Control type="text" placeholder="Search by film title" onChange={val => setInputValue(val.target.value)}></Form.Control>
          </Col>
          <Col><Button variant="secondary" onClick={() => {onSearch(inputValue)}}>Search</Button></Col>
        </Row>
      </Container>
      { films.length ? 
        <div>
          <ListGroup as="ul">
            { films.map(film => {
              return (
                <ListGroup.Item action key={film.episode_id} variant="dark" onClick={() => onFilmClick(film)}>
                  <h2>{film.title} ({new Date(film.release_date).getFullYear()})</h2>
                </ ListGroup.Item>
              );
            }) }
          </ListGroup>
        </div> : 
        <div>{ isLoading ? 'Fetching films...' : 'No results found'}</div> 
      }

      <Modal show={isModalOpen} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedFilm?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { selectedFilm?.release_date ? (<p>Release Date: {`${selectedFilm.release_date}`}</p>) : null }
          <p>Director: {selectedFilm?.director}</p>
          <p>Episode Number: {selectedFilm?.episode_id}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

