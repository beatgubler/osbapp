import './App.css';
import Container from '@mui/material/Container';

import Finance from './components/Finance';
import { Fragment } from 'react';


function App() {
  return (
    <Fragment> 
      <Container maxWidth="xl">
        <Finance />
      </Container>
      <div>
        osbapp by <a href="https://github.com/beatgubler" target="_blank" rel="noreferrer" style={{color: 'black'}}>Beat Gubler</a>
      </div>
    </Fragment>
  );
}

export default App;
