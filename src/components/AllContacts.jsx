import axios from "axios";
import { Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoMdContact } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import AddEditViewModal from "./common/AddEditViewModal";

const AllContacts = () => {
  const baseUrl = "http://localhost:3000";
  const [allContacts, setAllContacts] = useState([]);
  const [originalContact, setOriginalContacts] = useState([]);
  const [type,setType]=useState('')
  const [modal, setModal] = useState(false);
  const [id,setId]=useState(null);

  useEffect(() => {
    getContactData();
  }, []);

  const getContactData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/contacts`);
      setAllContacts(response?.data);
      setOriginalContacts(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleModal = (e, type) => {
    setModal(!modal);
    setType(type)
  };

  const handleChange = (e) => {
    const searchQuery = e?.target?.value?.toLowerCase();
    const filteredContacts = allContacts?.filter((item) => {
      return (
        item.name?.toLowerCase()?.includes(searchQuery) ||
        item.mobile?.includes(searchQuery)
      );
    });
    setAllContacts(filteredContacts);
    if (searchQuery === "") {
      setAllContacts(originalContact); // Reset to original contacts
    } else {
      setAllContacts(filteredContacts); // Update state with filtered contacts
    }
  };

  const handleDelete = async (e, id) => {
    const response = await axios.delete(`${baseUrl}/contacts/${id}`);
    getContactData();
  };


  const handleEditView=(e, id, type)=>{
    setId(id)
    setModal(!modal);
    setType(type)
  }

 useEffect(()=>{
    if(type && (type == 'add' || type == 'edit')) getContactData();
 },[modal])

  return (
    <>
      <section>
        <div className="container">
          <div className="contact-block">
            <div className="contact-info">
              <p className="p-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="add-btn"
                  onClick={(e)=>toggleModal(e, 'add')}
                >
                  Add Contact <CiCirclePlus className="add-icon" />
                </Button>
              </p>

              <div className="p-2">
                <p className="d-flex justify-content-center">
                  <Form.Control
                    type="email"
                    className="search-field"
                    placeholder="search contacts"
                    onChange={(e) => handleChange(e)}
                  />
                </p>
              </div>

              <div className="p-2">
                {allContacts?.length > 0 &&
                  allContacts?.map((item, index) => (
                    <div className="contact-list mt-2" key={index}>
                      <div>{item.id}</div>
                      <div>
                        <div className="d-flex align-items-center">
                          <IoMdContact className="contact-icon" />{" "}
                          <div className="d-flex flex-column">
                            {" "}
                            <p className="m-0">{item.name}</p>{" "}
                            <p className="m-0">{item.mobile}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <FaEye className="add-icon" onClick={(e) => handleEditView(e, item.id, 'view')}/>
                        <MdDelete
                          className="add-icon"
                          onClick={(e) => handleDelete(e, item.id)}
                        />
                        <MdEdit className="add-icon" onClick={(e) => handleEditView(e, item.id, 'edit')}/>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {(modal) ? <AddEditViewModal show={modal} title={type} setModal={setModal} id={id}/> : null}
    </>
  );
};

export default AllContacts;
