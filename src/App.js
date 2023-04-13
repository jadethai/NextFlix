import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { data } from './data.js';

async function getRecommendations(movieName) {
  const res = await fetch("http://127.0.0.1:8000/search?q=" + movieName)
  const data = await res.json();
  return data;
  }

function App() {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const calculationResult = await getRecommendations(inputValue); // Perform the desired calculation here
    setResult(calculationResult);
  };

  //   return (
//     <div>
//       <form onSubmit={handleFormSubmit}>
//         <label>
//           Enter a number:
//           <input type="text" value={inputValue} onChange={handleInputChange} />
//         </label>
//         <button type="submit">Calculate</button>
//       </form>
//       {result && <p>The result is: {result}</p>}
//     </div>
//   );
// }

  return (
    <div>
      <Container>
        <h1 className='text-center mt-4'>Netflix Recommender</h1>
        <Form onSubmit={handleFormSubmit}>
          <InputGroup className='my-3'>
            <Form.Control
              onChange={handleInputChange}
              type="text"
              placeholder='Search Movies/TV Shows'
              value={inputValue}
            />
            <button type="submit">Search</button> 
          </InputGroup>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Movie/TV Show Title</th>
              <th>Genre</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {
              result.map((item, index) => (
              <tr key={index}>
                <td>{item.Title}</td>
                <td>{item.Genre}</td>
                <td>{item.Description}</td>
              </tr>
            ))}
          </tbody>
        </Table> 
      </Container>
    </div>
  );
}

export default App;

{/* 
<Table striped bordered hover>
<thead>
  <tr>
    <th>Movie/TV Show Title</th>
    <th>Genre</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  {data
    .filter(async (item) => {
      if (search.toLowerCase() === '') {
        return true;
      } else if (item["title"].toLowerCase().includes(search)) {
        const results = await getRecommendations(search);
        return results.some((result) => result.title === item["title"]);
      }
    })
    .map((item, index) => (
      <tr key={index}>
        <td>{item["title"]}</td>
        <td>{item["listed_in"]}</td>
        <td>{item["description"]}</td>
      </tr>
    ))}
</tbody>
</Table>  */}

// function App() {
//   const [inputValue, setInputValue] = useState('');
//   const [result, setResult] = useState('');

//   const handleInputChange = (event) => {
//     setInputValue(event.target.value);
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     const calculationResult = inputValue * 2; // Perform the desired calculation here
//     setResult(calculationResult);
//   };

//   return (
//     <div>
//       <form onSubmit={handleFormSubmit}>
//         <label>
//           Enter a number:
//           <input type="text" value={inputValue} onChange={handleInputChange} />
//         </label>
//         <button type="submit">Calculate</button>
//       </form>
//       {result && <p>The result is: {result}</p>}
//     </div>
//   );
// }

// export default App;

// {data
//   .filter((item) => {
//     return search.toLowerCase() === ''
//       ? item
//       : item.title.toLowerCase().includes(search);
//   })
//   .map((item, index) => (
//     <tr key={index}>
//       <td>{item.title}</td>
//       <td>{item.listed_in}</td>
//       <td>{item.description}</td>
//     </tr>
//   ))}
