import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import HomeService from "../../../Service/HomeService";
import PageLoader from "../../../Loader/PageLoader";
import ImageLoader from "../../../Loader/ImageLoader";
import HttpClientXml from "../../../Utils/HttpClientXml";
import moment from "moment";
import { getDateInMMDDYYYY } from "../../../Utils/DateFunction";

const INITIAL = {
    eventID: "",
    sessionName: "",
    sessionDetails: "",
    sessionDate: "",
    startTime: "",
    endTime: "",
    priority: "",
    images: "",
};

const AddAndManageSession = () => {
  const [eventData, setEventData] = useState(INITIAL);
  const [AllEventData , setAllEventData] = useState([]);
  const [AllSessionData , setAllSessionData] = useState([])
  const [loading, setLoading] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [hide, setHide] = useState(true);
  const [id, setId] = useState("");

  useEffect(() => {
    fetchAllSessionData();
    fetchAllEventData()
  }, []);

  const fetchAllEventData = async() => {
    let res = await HomeService.ViewAllEvent();
    if(res && res?.status){
        setAllEventData(res?.data);
    }else{
        toast.error(res?.message)
    }
  }

  const HandleChange = (e) => {
    setEventData({
        ...eventData , [e.target.name]:e.target.value
    })
  }


  const HandleCrossClick = () => {
    setEventData({
        ...eventData,images:""
    })
    let file = document.querySelector("#LearningCategory");
    file.value = "";
  };



  const HandleImage = async (e) => {
    setImageLoader(true);
    let file = e.target.files[0];
    let data = new FormData();
    data.append("image", file);
    let res = await HttpClientXml.fileUplode("upload-Image", "POST", data);
    if (res && res.status) {
      // console.log("UploadImage", res);
      setEventData({
        ...eventData , images:res?.url
      })
    //   setImage(res?.url);
      setImageLoader(false);
    } else {
      toast.error(res?.message);
      setImageLoader(false);
    }
  };

  const onEdit = (item) => {
    window.scroll(0, 0);
    setEventData({
        ...eventData ,eventID:item?.eventID,
        sessionName:item?.sessionName,
        sessionDate:    moment(item?.sessionDate).format('YYYY-MM-DD'),  // getDateInMMDDYYYY(item?.startDate), // moment(item?.startDate).format('MM-DD-YYYY HH:mm:ss'),
        sessionDetails:item?.sessionDetails,
        startTime:item?.startTime,
        endTime:item?.endTime,
        priority:item?.priority,
        images:item?.images
    })
    setId(item?._id);
    setHide(false);
  };

  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't  to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        HomeService.DeleteSession(id)
          .then((res) => {
            if (res && res.status) {
              toast.success("Deleted Successfully");

              fetchAllSessionData();
            } else {
              toast.error(res?.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const fetchAllSessionData = () => {
    setLoading(true);
    HomeService.ViewAllSession()
      .then((res) => {
        if (res && res?.status) {
          setLoading(false);
          let arr = res?.data?.map((item, index) => {
            return {
              sl: index + 1,
              eventName:item?.EventDetails?.eventName,
              sessionDetails:item?.sessionDetails,
              sessionName:item?.sessionName,
              sessionDate: moment(item?.sessionDate).format('YYYY-MM-DD'),
              startTime:item?.startTime,
              endTime:item?.endTime,
              priority:item?.priority,
              images: (
                <>
                  {item?.images ? (
                    <img
                      style={{
                        height: "65%",
                        width: "65%",
                        borderRadius: "9px",
                        margin: "5px",
                      }}
                      src={item?.images}
                    />
                  ) : (
                    <img
                      style={{
                        height: "11%",
                        width: "11%",
                        borderRadius: "9px",
                        margin: "5px",
                      }}
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
                      }
                    />
                  )}
                </>
              ),
              action: (
                <div style={{ display: "flex", flexDirection: "coloum" }}>
                  <svg
                    onClick={() => onEdit(item)}
                    style={{
                      height: "20px",
                      width: "20px",
                      cursor: "pointer",
                      marginRight: "20px",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pencil-square"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path
                      fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                    />
                  </svg>
                  <svg
                    onClick={() => onDelete(item?._id)}
                    style={{
                      color: "red",
                      height: "20px",
                      cursor: "pointer",
                      width: "20px",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                  </svg>
                </div>
              ),
            };
          });
          setAllSessionData(arr);
        }
        console.log("RESPONSE", res);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
      });
  };

    const AddSession = () => {
      let data = eventData;
      if (eventData?.eventID && eventData?.sessionName && eventData?.sessionDetails && eventData?.sessionDate && eventData?.startTime&&
        eventData?.endTime && eventData?.priority && eventData?.images ) {
        HomeService.AddSession(data)
          .then((res) => {
            if (res && res.status) {
              toast.success(res.message);
              setEventData(INITIAL)
              fetchAllSessionData();

            } else {
              toast.error(res?.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        toast.error("All fields are required");
      }
    };

  const columns = [
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          SL
        </div>
      ),
      selector: (row) => row.sl,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          EventName
        </div>
      ),
      selector: (row) => row.eventName,
      width:"15rem"
    },

    {
        name: (
          <div
            style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
          >
            SessionName
          </div>
        ),
        selector: (row) => row.sessionName,
      },
      
      {
        name: (
          <div
            style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
          >
            SessionDetails
          </div>
        ),
        selector: (row) => row.sessionDetails,
      },
      {
        name: (
          <div
            style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
          >
            Images
          </div>
        ),
        selector: (row) => row.images,
      },
      {
        name: (
          <div
            style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
          >
            SessionDate
          </div>
        ),
        selector: (row) => row.sessionDate,
      },
      {
        name: (
          <div
            style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
          >
            StartTime
          </div>
        ),
        selector: (row) => row.startTime,
      },
      {
        name: (
          <div
            style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
          >
            EndTime
          </div>
        ),
        selector: (row) => row.endTime,
      },
      
      {
        name: (
          <div
            style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
          >
            Priority
          </div>
        ),
        selector: (row) => row.priority,
      },
    {
      name: (
        <div
          style={{
            fontSize: "14px",
            color: "#495057",
            marginLeft: "15px",
            fontWeight: "bolder",
          }}
        >
          Action
        </div>
      ),
      selector: (row) => row.action,
    },
  ];

    const UpdateSession = () => {
        let data = eventData;
        if (eventData?.eventID && eventData?.sessionName && eventData?.sessionDetails && eventData?.sessionDate && eventData?.startTime&&
            eventData?.endTime && eventData?.priority && eventData?.images) {
          HomeService.UpdateSession(id,data)
            .then((res) => {
              if (res && res.status) {
                toast.success(res.message);
                setEventData(INITIAL)
                fetchAllSessionData();
                setHide(true)
  
              } else {
                toast.error(res?.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          toast.error("All fields are required");
        }
    };
  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <PageLoader />
        </div>
      ) : (
        <div component="div" className="TabsAnimation appear-done enter-done">
          <div className="main-card mb-3 card">
            <div className="card-body">
              {hide ? (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#868e96",
                    margin: "35px",
                  }}
                  className="card-title"
                >
                  Add Session
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#868e96",
                    margin: "35px",
                  }}
                  className="card-title"
                >
                  Edit Session
                </div>
              )}

              <div class="row" style={{ marginBottom: "1rem" }}>
                <div class="col">
                  <label for="inputEmail4">
                    Event Name<span style={{ color: "red" }}>*</span> :
                  </label>

                  <select
                    style={{ marginBottom: "21px" }}
                    class="form-select"
                    aria-label="select category"
                    name="eventID"
                    value={eventData?.eventID}
                    onChange={(e) => HandleChange(e)}
                  >
                    <option value={""}>Select a event name.......</option>
                    {AllEventData?.map((item) => {
                      return (
                        <option id={item?._id} value={item?._id}>
                          {item?.eventName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div class="col">
                  <label for="inputEmail4">
                  SessionName<span style={{ color: "red" }}>*</span> :
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    name="sessionName"
                    value={eventData?.sessionName}
                    onChange={(e) => HandleChange(e)}
                    placeholder="Enter sessionName..."
                  />
                </div>
              </div>

              <div class="row" style={{ marginBottom: "1rem" }}>
                <div class="col">
                  <label for="inputEmail4">
                  SessionDetails<span style={{ color: "red" }}>*</span> :
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    name="sessionDetails"
                    value={eventData?.sessionDetails}
                    onChange={(e) => HandleChange(e)}
                    placeholder="Enter sessionDetails..."
                  />
                </div>

                <div class="col">
                  <label for="inputEmail4">
                  SessionDate<span style={{ color: "red" }}>*</span> :
                  </label>
                  <input
                    type="date"
                    class="form-control"
                    name="sessionDate"
                    placeholder="Enter sessionDate..."
                    value={eventData?.sessionDate}
                    onChange={(e) => HandleChange(e)}
                  />
                </div>
              </div>

              <div class="row" style={{ marginBottom: "1rem" }}>
                <div class="col">
                  <label for="inputEmail4">
                    Start Time<span style={{ color: "red" }}>*</span> :
                  </label>
                  <input
                    type="time"
                    class="form-control"
                    name="startTime"
                    value={eventData?.startTime}
                    onChange={(e) => HandleChange(e)}
                    placeholder="Enter start time..."
                  />
                </div>

                <div class="col">
                  <label for="inputEmail4">
                    End Time<span style={{ color: "red" }}>*</span> :
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    class="form-control"
                    placeholder="Enter end time..."
                    value={eventData?.endTime}
                    onChange={(e) => HandleChange(e)}
                  />
                </div>
              </div>


              <div class="row" style={{ marginBottom: "1rem" }}>
                <div class="col">
                  <label for="inputEmail4">
                    Priority<span style={{ color: "red" }}>*</span> :
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    name="priority"
                    placeholder="Enter priority..."
                    value={eventData?.priority}
                    onChange={(e) => HandleChange(e)}
                  />
                </div>
              </div>

              <div>
                <label for="exampleInputEmail1">
                  Image<span style={{ color: "red" }}>*</span> :
                </label>

                <input
                  class="form-control"
                  onChange={(e) => HandleImage(e)}
                  name="images"
                  type="file"
                  id="LearningCategory"
                  accept="image/*"
                />
              </div>

              {imageLoader ? (
                <>
                  <ImageLoader />{" "}
                </>
              ) : null}

              {eventData?.images && (
                <>
                  <div>
                    <img
                      style={{
                        height: "10%",
                        width: "10%",
                        marginTop: "12px",
                        borderRadius: "5px",
                      }}
                      src={eventData?.images}
                    />
                    <button
                      onClick={() => HandleCrossClick()}
                      style={{ color: "red" }}
                      type="button"
                      class="btn-close"
                      aria-label="Close"
                    ></button>
                  </div>
                </>
              )}

              {hide ? (
                <button class="btn btn-primary" style={{ marginTop:"1rem"}} onClick={AddSession}>
                  Submit
                </button>
              ) : (
                <button class="btn btn-primary"  style={{ marginTop:"1rem"}} onClick={UpdateSession}>
                  Update
                </button>
              )}

              <div
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  color: "#868e96",
                  margin: "35px",
                }}
                className="card-title"
              >
                Manage Session
              </div>
              <DataTable columns={columns} data={AllSessionData} pagination />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAndManageSession