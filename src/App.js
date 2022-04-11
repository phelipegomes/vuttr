import React, { useEffect, useState } from 'react';
import api from './api';

/* Custom SVG */
import iconClose from './icons/Icon-Close-2px.svg';
import iconPlus from './icons/Icon-Plus-Circle-2px.svg';
import iconSearch from './icons/Icon-Search-2px.svg';


/* Custom CSS */
import './App.css';

/* Bootstrap */
import { Button, Modal, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {

  /* States of components  */
  const [tools, setTools] = useState([]);
  const [toolName, setToolName] = useState('');
  const [toolLink, setToolLink] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [toolTags, setToolTags] = useState(["customize", "reactJS", "notchange"]);
  const [selectedTool, setSelectedTool] = useState();

  /* States of Modals */
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);

  /* States of Inputs */
  const [inputSearch, setInputSearch] = useState('');
  const [checkbox, setCheckbox] = useState(false);

  /* Modal Controllers - Add Tools */
  const handleCloseModalAdd = () => {
    setShowModalAdd(false);
    window.location.reload(false);
  };

  const handleShowModalAdd = () => {
    setShowModalAdd(true);
  };

  /* Modal Controllers - Remove Tools */
  const handleCloseModalRemove = () => {
    setShowModalRemove(false);
    window.location.reload(false);
  };

  const handleShowModalRemove = () => {
    setShowModalRemove(true);
  };

  /* Initialization API with all items */
  useEffect(() => {
    api
      .get("")
      .then((response) => setTools(response.data))
      .catch((err) => {
        console.error("Failed to get API response" + err);
      });

  }, []);

  /* POST: Adding New Tools with modal */
  const addTool = () => {
    api.post("", {
      title: toolName,
      link: toolLink,
      description: toolDescription,
      tags: toolTags
    }
    )
  }

  /* DELETE: Deleting by ID Tools with confirmation modal */
  const removeTool = (id) => {
    api.delete(`${id}`);
  }

  /* Search Tools in API */
  const searchTool = (input) => {
    if (!checkbox) {

      /* GET: Searching by all positions in API */
      api
        .get(`?q=${input}`)
        .then((response) => setTools(response.data))
        .catch((err) => {
          console.error("Failed to get API response" + err);
        });

    } else {

      /* GET: Searching by TAGS position in API */
      api
        .get(`?tags_like=${input}`)
        .then((response) => setTools(response.data))
        .catch((err) => {
          console.error("Failed to get API response" + err);
        });
    }
  }  

/* Starting Render HTML components */
  return (


    <div className="App body">
      <Container className="pt-4">
        <Row className="pt-2">
          <h1>VUTTR</h1>
        </Row>
        
        <Row className="pt-2">
          <h3>Very Useful Tools to Remeber</h3>
        </Row>

        <Row className="pt-2">
          <Col sm={8} xs={8} md={8} lg={8} xl={8} xxl={8}>
            <input
              className="input-search"
              type="text"
              placeholder="Enter text"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}>
            </input>

            <span className="p-2">
              <button className="button-search" onClick={() => searchTool(inputSearch)}>Search</button>
            </span>

            <div>
            <input
              className="checkbox-tags mt-3"
              type="checkbox"
              onChange={() => {
                if (checkbox) {
                  setCheckbox(false);
                } else {
                  setCheckbox(true);
                }
              }}>
            </input>

            <span className="p-2">Search in tags only</span>
            </div>
          </Col>

          <Col sm={4} xs={4} md={4} lg={4} xl={4} xxl={4}>
            <button className="float-end button-add" onClick={() => handleShowModalAdd()}><img className="custom-svg" src={iconPlus}/>Add</button>
          </Col>
        </Row>

        <Row className="pt-5">
          <div className="list">


            {tools.map(tools => (

              <span key={tools.title} className="pt-5">
                <div className="card-list">
                <Row>
                  <Col>
                    <a href={tools.link}><h3>{tools.title}</h3></a>
                  </Col>
                  <Col>
                    <span className="float-end align-text-center remove-button" onClick={() => {
                      setSelectedTool(tools.id);
                      handleShowModalRemove()
                    }}><img className="custom-svg-remove" src={iconClose}/> remove
                    </span>
                  </Col>
                </Row>

                <div className="pb-4">
                  {tools.description}<br />
                  {tools.tags.map(tags => (
                    <strong>
                      <span key={tags}>#{tags}  &nbsp; </span>
                    </strong>
                  ))}
                   </div>
                </div>
              </span>
            ))}
          </div>
          
        </Row>

        {/* MODAL QUE PARA ADICIONAR FERRAMENTAS */}

        <Modal show={showModalAdd} onHide={() => handleCloseModalAdd()}>
          <Modal.Header closeButton>
            <Modal.Title>+ Add new tool</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Tool Name</h6>
            <input
              className="input-text-modal"
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
            />
            <br />

            <h6>Tool Link</h6>
            <input
              className="input-text-modal"
              type="text"
              value={toolLink}
              onChange={(e) => setToolLink(e.target.value)}
            />
            <br />

            <h6>Tool description</h6>
            <input
              className="input-text-modal"
              type="text"
              value={toolDescription}
              onChange={(e) => setToolDescription(e.target.value)}
            />
            <br />

            <h6>Tags</h6>
            <input
              className="input-text-modal"
              type="text"
              value={toolTags}
              onChange={(e) => setToolTags(e.target.value)}
            />

          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => { addTool(); handleCloseModalAdd() }}>
              Add tool
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODAL QUE PARA REMOVER FERRAMENTAS */}

        <Modal show={showModalRemove} onHide={() => handleCloseModalRemove()}>
          <Modal.Header closeButton>
            <Modal.Title>x Remove tool</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Are you sure you want to remove  ?</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => { removeTool(selectedTool); handleCloseModalRemove() }}>
              Yes, remove
            </Button>
            <Button variant="secondary" onClick={() => { handleCloseModalRemove() }}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div >
  );
}