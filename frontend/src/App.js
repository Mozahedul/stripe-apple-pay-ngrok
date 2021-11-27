import React from 'react';
import { Button, Container, Jumbotron } from 'react-bootstrap';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApplePay from './ApplePay';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Container className="mt-4">
            <Jumbotron>
              <h1>Apple Pay With Stripe</h1>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <Link to="/apple-pay">
                <Button>Apple Pay</Button>
              </Link>
            </Jumbotron>
          </Container>
        </Route>

        <Route path="/apple-pay">
          <ApplePay />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
