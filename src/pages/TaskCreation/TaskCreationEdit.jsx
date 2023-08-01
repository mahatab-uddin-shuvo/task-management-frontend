import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm, setValue } from "react-hook-form";
import { Button, Form, Toast } from "react-bootstrap";
import http from "../../http";
import TextLineLoader from "../../components/Loaders/TextLineLoader";
import loginCheck from "../../helpers/loginCheck";
import Layout from "../../components/layouts/layout";
import Cookies from "universal-cookie";
import { DatePicker, SelectPicker } from "rsuite";
import { status } from "../enum/enum";
import isBefore from 'date-fns/isBefore';

const TaskCreationEdit = () => {
  const { id } = useParams();
  const [taskCreation, setTaskCreation] = useState("");
  const { register, handleSubmit } = useForm();
  const [getErrorObj, setErrorObj] = useState({});
  const [getLoader, setLoader] = useState(false);

  const cookies = new Cookies();

  const navigate = useNavigate();
  useEffect(() => {
    if (!loginCheck()) {
      navigate("/login");
    }
  });

  //get data fromm api

  useEffect(() => {
    fetchEditTaskCreation();
  }, []);

  const fetchEditTaskCreation = () => {
    http
      .get("task/get/" + id, {
        headers: {
          Authorization: "Bearer " + cookies.get("userAuth").token,
        },
      })
      .then((res) => {
        setTaskCreation(res.data.data);
      });
  };

  function removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v != null && v != "")
        .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
    );
  }

  //after submitting form then api call
  const onSubmit = (data, e) => {
    setErrorObj({});
    data = { ...data, ...taskCreation };
    setLoader(true);

    http
      .post("/task/update/" + id, data, {
        headers: {
          Authorization: "Bearer " + cookies.get("userAuth").token,
        },
      })
      .then((res) => {
        localStorage.setItem("successEdit", true);
        setTimeout(() => {
          navigate("/task-creation");
        }, 500);
      })
      .catch((err) => {
        //validation check
        setLoader(false);
        if (err.response.data.message == "Validation Error.") {
          let errs = err.response.data.data;
          let keys = Object.keys(errs);
          let errors = {};
          keys.map((key) => (errors[key] = errs[key][0]));

          setErrorObj(errors);
        }
      });
  };

  const onError = (errors, e) => console.log(errors, e);
  const handleChange = (e) => {
    setErrorObj({});
    let task = { ...taskCreation };
    task[e.target.name] = e.target.value;
    setTaskCreation(task);
  };

  const frommateDate = (val) => {
    let tempDate = new Date(val).toUTCString().toString();
    let fetchDate = tempDate.substring(5, 7);

    let monthConvert =
      tempDate.substring(8, 11) == "Jan"
        ? "01"
        : tempDate.substring(8, 11) == "Feb"
        ? "02"
        : tempDate.substring(8, 11) == "Mar"
        ? "03"
        : tempDate.substring(8, 11) == "Apr"
        ? "04"
        : tempDate.substring(8, 11) == "May"
        ? "05"
        : tempDate.substring(8, 11) == "Jun"
        ? "06"
        : tempDate.substring(8, 11) == "Jul"
        ? "07"
        : tempDate.substring(8, 11) == "Aug"
        ? "08"
        : tempDate.substring(8, 11) == "Sep"
        ? "09"
        : tempDate.substring(8, 11) == "Oct"
        ? "10"
        : tempDate.substring(8, 11) == "Nov"
        ? "11"
        : tempDate.substring(8, 11) == "Dec"
        ? "12"
        : null;
    let date = tempDate.substring(12, 16) + "-" + monthConvert + "-" + fetchDate;

    let time = new Date(val).toLocaleTimeString("en-US", {
      hour12: false,
    });
    var combineDate = date + " " + time;
    return combineDate;
  };

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
  
    return previous;
  }

  return (
    <>
      <Layout>
        {getLoader && (
          <div className="preloader">
            <div className="overlay__inner">
              <div className="overlay__content">
                <span className="spin"></span>
              </div>
            </div>
          </div>
        )}

        {taskCreation == "" ? (
          <>
            <TextLineLoader />
            <TextLineLoader />
            <TextLineLoader />
          </>
        ) : (
          <div className="form_design">
            <h2 style={{ color: "black", textDecoration: "underline" }}>
              Edit Task Creation
            </h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group>
                <Form.Label className="form_label">Title</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  defaultValue={taskCreation.title}
                  placeholder="Enter title"
                  onChange={(e) => handleChange(e)}
                />
                {getErrorObj.title ? (
                  <span className="text-danger">{getErrorObj.title}</span>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label className="form_label">Description</Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={5}
                    defaultValue={taskCreation.description}
                    type="text"
                    name="description"
                    maxLength={"160"}
                    placeholder="Enter Description"
                    onChange={(e) => handleChange(e)}
                />
                
                {getErrorObj.description ? (
                    <span className="text-danger">{getErrorObj.description}</span>
                ) : null}
            </Form.Group>

              <Form.Group>
                <Form.Label className="form_label">Duration</Form.Label>
                <DatePicker
                  defaultValue={
                    taskCreation.duration ? new Date(taskCreation.duration) : ""
                  }
                  oneTap
                  format="yyyy-MM-dd hh:mm:ss aa"
                  showMeridian
                  showWeekNumbers
                  style={{ width: "100%" }}
                  disabledDate={date => isBefore(date, getPreviousDay())}
                  onChange={(value) =>
                    setTaskCreation({
                      ...taskCreation,
                      duration: frommateDate(value),
                    })
                  }
                />
                {getErrorObj.description ? (
                  <span className="text-danger">{getErrorObj.description}</span>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label className="form_label">Status</Form.Label>
                <SelectPicker
                    defaultValue={taskCreation.status}
                    data={Object.values(status)?.map((item) => ({
                        label: item,
                        value: item,
                      }))}                       
                        style={{ width: "100%" }} 
                    onChange={(value) => setTaskCreation({ ...taskCreation, "status": value})}
                  />
                {getErrorObj.status? 
                <span className="text-danger">
                    {getErrorObj.status}
                </span> : null
                }
                </Form.Group>

              <div className="mt-4">
                <Button className="action__btn" variant="primary" type="submit">
                  Update
                </Button>
                <Link to="/task-creation">
                  <Button className="action__btn" variant="info">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </Form>
          </div>
        )}
      </Layout>
    </>
  );
};

export default TaskCreationEdit;
