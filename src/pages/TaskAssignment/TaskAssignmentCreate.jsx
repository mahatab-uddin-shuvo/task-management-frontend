import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Form, Toast } from "react-bootstrap";
import http from "../../http";
import Layout from "../../components/layouts/layout";
import loginCheck from "../../helpers/loginCheck";
import Cookies from "universal-cookie";
import { SelectPicker } from "rsuite";

const TaskAssignmentCreate = () => {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState("");
  const [user2, setUser2] = useState("");
  const [user, setUser] = useState([]);
  const [getSuccess, setSuccess] = useState(false);
  const [getError, setError] = useState("");
  const [getErrorObj, setErrorObj] = useState({});

  const [getLoader, setLoader] = useState(false);
  const [task2, setTask2] = useState("");
  const [task, setTask] = useState([]);

  const cookies = new Cookies();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loginCheck()) {
      console.log("this works");
      navigate("/login");
    }
  });


  const getUserSearch = (val) => {
    if (val.length > 1) {
      http
        .get(`/user/search/${val}`, {
          headers: {
            Authorization: "Bearer " + cookies.get("userAuth").token,
          },
        })
        .then((response) => {
          setUser(response.data.data.data);
        });
    } else if (user2.assign_for) {
      http
        .get(`/user/get/${user2.assign_for}`, {
          headers: {
            Authorization: "Bearer " + cookies.get("userAuth").token,
          },
        })
        .then((response) => {
          setUser([response.data.data]);
        });
    } else {
      setUser([]);
    }
  };

  const getTaskSearch = (val) => {
    if (val.length > 1) {
      http
        .get(`/task/search/${val}`, {
          headers: {
            Authorization: "Bearer " + cookies.get("userAuth").token,
          },
        })
        .then((response) => {
          setTask(response.data.data.data);
        });
    } else if (task2.task_id) {
      http
        .get(`/task/get/${task2.task_id}`, {
          headers: {
            Authorization: "Bearer " + cookies.get("userAuth").token,
          },
        })
        .then((response) => {
          setTask([response.data.data]);
        });
    } else {
      setTask([]);
    }
  };

  function removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v != null && v != "")
        .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
    );
  }



  const onSubmit = (data, e) => {
    setErrorObj({});
  
    data = { ...data, ...user2, ...task2 };
    data = removeEmpty(data);
    console.log(data)
    // return 

    setLoader(true);

    http
      .post("/task-assignment/assign", data, {
        headers: {
          Authorization: "Bearer " + cookies.get("userAuth").token,
        },
      })
      .then((res) => {
        console.log("CODE", res, res.data.data.area_id);
        // setTaskId(res.data.data.area_id);
        setSuccess(true);
        localStorage.setItem("success", true);
        // setLoader(false);

        
        setTimeout(() => {
          navigate("/task-assignment");
        }, 1000);
      })
      .catch((err) => {
        setLoader(false);

        if (err.response.data.message == "Validation Error.") {
          let errs = err.response.data.data;
          let keys = Object.keys(errs);
          console.log(keys);
          let errors = {};
          keys.map((key) => (errors[key] = errs[key][0]));
          console.info(errors);
          setError(err.response.data);

          setErrorObj(errors);
        }
      });
  };
  const onError = (errors, e) => console.log(errors, e);
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

        <div className="form_design">
          <h2 style={{ color: "black", textDecoration: "underline" }}>
            Create Task Assignment
          </h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              <Form.Label className="form_label">Select User</Form.Label>
              <SelectPicker
                name="task_id"
                data={user?.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                style={{ width: "100%" }}
                onSearch={(val) => getUserSearch(val)}
                onChange={(value) =>
                  setUser2({ ...user2, "assign_for": value })
                }
              />
              {getErrorObj.assign_for ? (
                <span className="text-danger">{getErrorObj.assign_for}</span>
              ) : null}
            </Form.Group>

            <Form.Group>
              <Form.Label className="form_label">Select Task</Form.Label>
              <SelectPicker
                name="assign_for"
                data={task?.map((item) => ({
                  label: item.title,
                  value: item.id,
                }))}
                style={{ width: "100%" }}
                onSearch={(val) => getTaskSearch(val)}
                onChange={(value) => setTask2({ ...task2, "task_id": value })}
              />
              {getErrorObj.task_id ? (
                <span className="text-danger">{getErrorObj.task_id}</span>
              ) : null}
            </Form.Group>
            

            <div className="mt-4">
              <Button className="action__btn" variant="primary" type="submit">
                Save
              </Button>
              <Link to="/task-assignment">
                <Button className="action__btn" variant="info">
                  Back to Home
                </Button>
              </Link>
            </div>
          </Form>
        </div>
      </Layout>
    </>
  );
};

export default TaskAssignmentCreate;
