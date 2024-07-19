import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

/* Custom SVG */
import iconClose from './icons/Icon-Close-2px.svg';
import iconPlus from './icons/Icon-Plus-Circle-2px.svg';

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
  const [selectedTool, setSelectedTool] = useState();

  /* States of Modals */
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalRemove, setShowModalRemove] = useState(false);

  /* States of Inputs */
  const [inputSearch, setInputSearch] = useState('');

  /* Modal Controllers - Add Tools */
  const handleCloseModalAdd = () => {
    setShowModalAdd(false);
    fetchTools();
  };

  const handleShowModalAdd = () => {
    setShowModalAdd(true);
  };

  /* Modal Controllers - Remove Tools */
  const handleCloseModalRemove = () => {
    setShowModalRemove(false);
    fetchTools();
  };

  const handleShowModalRemove = () => {
    setShowModalRemove(true);
  };

  /* Fetch tools from Firestore */
  const fetchTools = async () => {
    try {
      const q = query(collection(db, "tools"));
      const querySnapshot = await getDocs(q);
      const toolsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTools(toolsData);
    } catch (err) {
      console.error("Failed to get documents from Firestore", err);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  /* POST: Adding New Tools with modal */
  const addTool = async () => {
    try {
      await addDoc(collection(db, "tools"), {
        title: toolName,
        link: toolLink,
        description: toolDescription,
      });
      handleCloseModalAdd();
    } catch (err) {
      console.error("Failed to add document to Firestore", err);
    }
  };

  /* DELETE: Deleting by ID Tools with confirmation modal */
  const removeTool = async (id) => {
    try {
      await deleteDoc(doc(db, "tools", id));
      handleCloseModalRemove();
    } catch (err) {
      console.error("Failed to delete document from Firestore", err);
    }
  };

  /* Search Tools in Firestore */
  const searchTool = async (input) => {
    try {
      let q;
      q = query(collection(db, "tools"), where("title", ">=", input), where("title", "<=", input + '\uf8ff'));
    
      const querySnapshot = await getDocs(q);
      const toolsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTools(toolsData);
    } catch (err) {
      console.error("Failed to get documents from Firestore", err);
    }
  };

  return (
    <div className="App body">
      <Container className="pt-4">
        <Row className="pt-2">
          <h1>VUTTR</h1>
        </Row>
        <Row className="pt-2">
          <h3>Very Useful Tools to Remember</h3>
        </Row>
        <Row className="pt-2">
          <Col sm={8} xs={8} md={8} lg={8} xl={8} xxl={8}>
            <input
              className="input-search"
              type="text"
              placeholder="Enter text"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
            />
            <span className="p-2">
              <button className="button-search" onClick={() => searchTool(inputSearch)}>Search</button>
            </span>
          </Col>
          <Col sm={4} xs={4} md={4} lg={4} xl={4} xxl={4}>
            <button className="float-end button-add" onClick={handleShowModalAdd}>
              <img className="custom-svg" src={iconPlus} alt="Add" />Add
            </button>
          </Col>
        </Row>
        <Row className="pt-5">
          <div className="list">
            {tools.map(tool => (
              <span key={tool.id} className="pt-5">
                <div className="card-list">
                  <Row>
                    <Col>
                      <a href={tool.link}><h3>{tool.title}</h3></a>
                    </Col>
                    <Col>
                      <span className="float-end align-text-center remove-button" onClick={() => {
                        setSelectedTool(tool.id);
                        handleShowModalRemove();
                      }}>
                        <img className="custom-svg-remove" src={iconClose} alt="Remove" /> remove
                      </span>
                    </Col>
                  </Row>
                  <div className="pb-4">
                    {tool.description}<br />
                  </div>
                </div>
              </span>
            ))}
          </div>
        </Row>
        <Modal show={showModalAdd} onHide={handleCloseModalAdd}>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={addTool}>
              Add tool
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showModalRemove} onHide={handleCloseModalRemove}>
          <Modal.Header closeButton>
            <Modal.Title>x Remove tool</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>Are you sure you want to remove?</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => { removeTool(selectedTool); handleCloseModalRemove(); }}>
              Yes, remove
            </Button>
            <Button variant="secondary" onClick={handleCloseModalRemove}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
