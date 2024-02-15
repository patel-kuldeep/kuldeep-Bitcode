import { useEffect, useState } from "react";
import {
  Modal as ReactstrapModal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const AddEditViewModal = ({ show, title, setModal, id }) => {
  const baseUrl = "http://localhost:3000";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const toggleModal = () => {
    setModal(false);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Validate name
    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    // Validate mobile
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
      valid = false;
    } else if (!/^\+?[0-9]{1,3}-?[0-9]{3,}$/.test(formData.mobile)) {
      newErrors.mobile = "Invalid mobile number";
      valid = false;
    }

    // Validate address
    if (!formData.address) {
      newErrors.address = "Address is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const resp = await axios.post(`${baseUrl}/contacts`, formData);
        if (resp.status == 201) {
          toggleModal();
          setFormData({
            name: "",
            email: "",
            mobile: "",
            address: "",
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Form validation failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (title === "edit") {
      getEditData();
    } else if (title === "view") {
      getViewData();
    }
  }, []);

  // Calling Edit API

  const getEditData = async () => {
    try {
      const responseData = await axios.patch(`${baseUrl}/contacts/${id}`);
      const viewData = responseData?.data;
      setFormData({
        name: viewData.name,
        email: viewData.email,
        mobile: viewData.mobile,
        address: viewData.address,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // calling View API

  const getViewData = async () => {
    try {
      const responseData = await axios.get(`${baseUrl}/contacts/${id}`);
      const viewData = responseData?.data;
      setFormData({
        name: viewData.name,
        email: viewData.email,
        mobile: viewData.mobile,
        address: viewData.address,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate=async()=>{
    if (validateForm()) {
      try {
        const resp = await axios.put(`${baseUrl}/contacts/${id}`, formData);
          toggleModal();
          setFormData({
            name: "",
            email: "",
            mobile: "",
            address: "",
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Form validation failed");
    }
  }

  return (
    <>
      <ReactstrapModal isOpen={show} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
         
            {title === "add"
              ? "Add Contact"
              : title === "view"
              ? "View Contact"
              : title === "edit"
              ? "Update Contact"
              : ""}{" "}
            
          
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                disabled={title === "view"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                disabled={title === "view"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="mobile">
              <Form.Label>Mobile:</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                isInvalid={!!errors.mobile}
                disabled={title === "view"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.mobile}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                isInvalid={!!errors.address}
                disabled={title === "view"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>{" "}
            {title == "add" ? (
              <Button type="submit" color="primary">
                Submit
              </Button>
            ) : title == "edit" ? (
              <Button type="button" color="primary" onClick={handleUpdate}>
                Update
              </Button>
            ) : null}
          </Form>
        </ModalBody>
      </ReactstrapModal>
    </>
  );
};

export default AddEditViewModal;
