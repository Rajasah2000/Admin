import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import HomeService from "../../Service/HomeService";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import PageLoader from "../../Loader/PageLoader";

const AddAndManageSubscription = () => {
  const [subsriptionDuration , setSubsriptionDuration] = useState('');
  const [streamingNo , setStreamingNo] = useState(null);
  const [deviceNo , setDeviceNo] = useState(null);
  const [price , setPrice] = useState(null)

  const [allExpertise, setAllExpertise] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hide, setHide] = useState(true);
  const [id, setId] = useState("");

  useEffect(() => {
    fetchAllOttSubscription();
  }, []);

  const onEdit = (item) => {
    window.scroll(0, 0);
    setSubsriptionDuration(item?.subsriptionDuration);
    setStreamingNo(item?.streamingNo);
    setDeviceNo(item?.deviceNo);
    setPrice(item?.price);
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
        HomeService.DeleteOttSubscription(id)
          .then((res) => {
            if (res && res.status) {
              toast.success("Deleted Successfully");

              fetchAllOttSubscription();
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

  const fetchAllOttSubscription = () => {
    setLoading(true);
    HomeService.ViewOttSubscription()
      .then((res) => {
        if (res && res?.status) {
          setLoading(false);
          let arr = res?.data?.map((item, index) => {
            return {
              sl: index + 1,
              subsriptionDuration: item?.subsriptionDuration,
              streamingNo: item?.streamingNo,
              deviceNo:item?.deviceNo,
              price:item?.price,
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
          setAllExpertise(arr);
        }
        console.log("RESPONSE", res);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
      });
  };

  const AddSubscription = () => {
    let data = {
      subsriptionDuration:subsriptionDuration,
      streamingNo:streamingNo,
      deviceNo:deviceNo,
      price:price
    };

    if (subsriptionDuration && streamingNo && deviceNo && price) {
      HomeService.AddOttSubscription(data)
        .then((res) => {
          if (res && res.status) {
            toast.success(res.message);
            fetchAllOttSubscription();
            setSubsriptionDuration("");
            setStreamingNo("");
            setDeviceNo("");
            setPrice("");
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
          SubsriptionDuration
        </div>
      ),
      selector: (row) => row.subsriptionDuration,
    },
    
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          StreamingNo
        </div>
      ),
      selector: (row) => row.streamingNo,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          DeviceNo
        </div>
      ),
      selector: (row) => row.deviceNo,
    },
    {
      name: (
        <div
          style={{ fontSize: "14px", color: "#495057", fontWeight: "bolder" }}
        >
          Price
        </div>
      ),
      selector: (row) => row.price,
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

  const UpdateSubscription = () => {
    let data = {
      subsriptionDuration:subsriptionDuration,
      streamingNo:streamingNo,
      deviceNo:deviceNo,
      price:price
    };

    if (subsriptionDuration && streamingNo && deviceNo && price) {
      HomeService.EditOttSubscription(id , data)
        .then((res) => {
          if (res && res.status) {
            toast.success(res.message);
            fetchAllOttSubscription();
            setSubsriptionDuration("");
            setStreamingNo("");
            setDeviceNo("");
            setPrice("");
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
                  Add Subscription
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
                  Edit Subscription
                </div>
              )}

               
                  <div class="row" style={{ marginBottom: "1rem" }}>
                    <div class="col">
                      <label for="inputEmail4">
                      Subsription Duration<span style={{ color: "red" }}>*</span> :
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        value={subsriptionDuration}
                        onChange={(e) => setSubsriptionDuration(e.target.value)}
                        placeholder="Enter subsriptionDuration..."
                      />
                    </div>

                    <div class="col">
                      <label for="inputEmail4">
                      Streaming No<span style={{ color: "red" }}>*</span> :
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Enter streamingNo..."
                        value={streamingNo}
                        onChange={(e) => setStreamingNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="row" style={{ marginBottom: "1rem" }}>
                    <div class="col">
                      <label for="inputEmail4">
                      Device No<span style={{ color: "red" }}>*</span> :
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        value={deviceNo}
                        onChange={(e) => setDeviceNo(e.target.value)}
                        placeholder="Enter deviceNo..."
                      />
                    </div>

                    <div class="col">
                      <label for="inputEmail4">
                      Price<span style={{ color: "red" }}>*</span> :
                      </label>
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Enter price..."
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
               

              {hide ? (
                <button class="btn btn-primary" onClick={AddSubscription}>
                  Submit
                </button>
              ) : (
                <button class="btn btn-primary" onClick={UpdateSubscription}>
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
                Manage Subscription
              </div>
              <DataTable columns={columns} data={allExpertise} pagination />
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default AddAndManageSubscription