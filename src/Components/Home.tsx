import { Container } from "react-bootstrap";

export function Home() {
  return (
    <Container className="py-3 text-light">
      <h1>Hello, Worlds!</h1>
      <p>Welcome to your hub for all things Star Wars!</p>
      <p>Select a topic from the menu to explore the universe of Star Wars!</p>
    </Container>
  );
}