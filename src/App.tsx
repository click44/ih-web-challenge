import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import CSS from 'csstype';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Home } from './Components/Home';
import { Films } from './Components/Films';
import { People } from './Components/People';
import { Planets } from './Components/Planets';
import { Species } from './Components/Species';
import { Starships } from './Components/Starships';
import { Vehicles } from './Components/Vehicles';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: 'films',
      element: <Films />
    },
    {
      path: 'people',
      element: <People />
    },
    {
      path: 'planets',
      element: <Planets />
    },
    {
      path: 'species',
      element: <Species />
    },
    {
      path: 'starships',
      element: <Starships />
    },
    {
      path: 'vehicles',
      element: <Vehicles />
    }
  ]);

  return (
    <div className="bg-dark" style={styles.body}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">SWAPI</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/films">Films</Nav.Link>
              <Nav.Link href="/people">People</Nav.Link>
              <Nav.Link href="/planets">Planets</Nav.Link>
              <Nav.Link href="/species">Species</Nav.Link>
              <Nav.Link href="/starships">Starships</Nav.Link>
              <Nav.Link href="/vehicles">Vehicles</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <RouterProvider router={router} />

      <footer className="bg-secondary py-3 mt-auto" style={styles.footer}>
        <Container>
          <p className="text-light">&copy; 2023 My App</p>
        </Container>
      </footer>
    </div>
  );
}

const styles: { [key: string]: CSS.Properties } = {
  body: {
    minHeight: '100vh',
  },
  footer: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
  }
};

export default App;
