import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Dropdown, Input, Modal, Popover } from "antd";
import React, { useRef, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import uuid from "react-uuid";
import VimeePlaceholder from "../../../assets/images/placeholder.jpg";
import PlusIcon from "../../../assets/images/plusIcon.jpg";
import { base64ToFile, fileToBase64 } from "../../../commenFunctions";

const BottomPopupViewWithButton = ({
  personaData,
  setpersonaData,
  selectedPersona,
  selectedGroup,
  selectedApp,
  selectedFunction,
  selectedView,
  selectedIds,
  setselectedIds,
  setselectedPersona,
  setselectedGroup,
  setselectedApp,
  setselectedView,
  setselectedFunction,
  buttonName,
  placement,
  icon,
}) => {
  const [open, setopen] = useState(false);
  const [finalOpen, setfinalOpen] = useState(false);
  const [modalShow, setmodalShow] = useState(false);
  const [deleteModalShow, setdeleteModalShow] = useState(false);
  const [editmode, seteditmode] = useState(false);
  const [inputValue, setinputValue] = useState({
    name: "",
    pic: "",
    _id: "",
  });

  const [image, setimage] = useState("");
  const inputref = useRef();

  const makeData = (selected) => {
    const buttonData = ["views", "functions", "apps", "groups", "personas"];

    let newJson = null;

    for (let i = 0; i < buttonData.length; i++) {
      if (buttonData[i] == "views") {
        if (selected == buttonData[i]) {
          newJson = {
            ...inputValue,
            _id: uuid(),
          };
          break;
        } else {
          newJson = {
            name: "Default",
            pic: "",
            _id: uuid(),
          };
        }
      } else {
        if (selected == buttonData[i]) {
          newJson = {
            ...inputValue,
            [buttonData[i - 1]]: [newJson],
            _id: uuid(),
          };
          break;
        } else {
          newJson = {
            name: "Default",
            pic: "",
            [buttonData[i - 1]]: [newJson],
            _id: uuid(),
          };
        }
      }
    }

    return newJson;
  };

  const submitCreateEvent = () => {
    if (editmode) {
      var newData = personaData?.persona?.map((pdata) => {
        if (buttonName == "Persona") {
          if (pdata?._id == inputValue?._id) {
            return { ...pdata, name: inputValue?.name, pic: inputValue?.pic };
          } else {
            return pdata;
          }
        } else {
          return {
            ...pdata,
            groups: pdata?.groups?.map((gdata) => {
              if (buttonName == "Group") {
                if (gdata?._id == inputValue?._id) {
                  return {
                    ...gdata,
                    name: inputValue?.name,
                    pic: inputValue?.pic,
                  };
                } else {
                  return gdata;
                }
              } else {
                return {
                  ...gdata,
                  apps: gdata?.apps?.map((adata) => {
                    if (buttonName == "App") {
                      if (adata?._id == inputValue?._id) {
                        return {
                          ...adata,
                          name: inputValue?.name,
                          pic: inputValue?.pic,
                        };
                      } else {
                        return adata;
                      }
                    } else {
                      return {
                        ...adata,
                        functions: adata?.functions?.map((fdata) => {
                          if (buttonName == "Function") {
                            if (fdata?._id == inputValue?._id) {
                              return {
                                ...fdata,
                                name: inputValue?.name,
                                pic: inputValue?.pic,
                              };
                            } else {
                              return fdata;
                            }
                          } else {
                            return {
                              ...fdata,
                              views: fdata?.views?.map((vdata) => {
                                if (vdata?._id == inputValue?._id) {
                                  return {
                                    ...vdata,
                                    name: inputValue?.name,
                                    pic: inputValue?.pic,
                                  };
                                } else {
                                  return vdata;
                                }
                              }),
                            };
                          }
                        }),
                      };
                    }
                  }),
                };
              }
            }),
          };
        }
      });

      setpersonaData({ persona: newData });
    } else {
      const makeJson = makeData(`${buttonName.toLowerCase()}s`);

      if (buttonName == "Persona") {
        var newData = {
          ...personaData,
          persona: [...personaData?.persona, makeJson],
        };
      } else {
        var newData = {
          ...personaData,
          persona: personaData?.persona?.map((pdata) => {
            if (pdata?._id == selectedPersona?._id) {
              if (buttonName == "Group") {
                return { ...pdata, groups: [...pdata?.groups, makeJson] };
              } else {
                return pdata?.groups?.map((gdata) => {
                  if (gdata?._id == selectedGroup?._id) {
                    if (buttonName == "App") {
                      return { ...gdata, apps: [...gdata?.apps, makeJson] };
                    } else {
                      return gdata?.apps?.map((adata) => {
                        if (adata?._id == selectedApp?._id) {
                          if (buttonName == "Function") {
                            return {
                              ...adata,
                              functions: [...adata?.functions, makeJson],
                            };
                          } else {
                            return adata?.functions?.map((fdata) => {
                              if (fdata?._id == selectedFunction?._id) {
                                if (buttonName == "View") {
                                  return {
                                    ...fdata,
                                    views: [...fdata?.views, makeJson],
                                  };
                                } else {
                                  return fdata;
                                }
                              } else {
                                return fdata;
                              }
                            });
                          }
                        } else {
                          return adata;
                        }
                      });
                    }
                  } else {
                    return gdata;
                  }
                });
              }
            } else {
              return pdata;
            }
          }),
        };
      }

      setpersonaData(newData);
    }

    setinputValue({
      name: "",
      pic: "",
      _id: "",
    });
    setimage("");

    setmodalShow(false);
    seteditmode(false);
  };

  const deletePersona = () => {
    if (buttonName == "Persona") {
      var newData = personaData?.persona?.filter(
        (pdata) => pdata?._id !== inputValue?._id
      );
    } else {
      var newData = personaData?.persona?.map((pdata) => {
        if (buttonName == "Group") {
          return {
            ...pdata,
            groups: pdata?.groups?.filter(
              (gdata) => gdata?._id !== inputValue?._id
            ),
          };
        } else {
          return pdata?.groups?.map((gdata) => {
            if (buttonName == "App") {
              return {
                ...gdata,
                apps: gdata?.apps?.filter(
                  (adata) => adata?._id !== inputValue?._id
                ),
              };
            } else {
              return gdata?.apps?.map((adata) => {
                if (buttonName == "Function") {
                  return {
                    ...adata,
                    functions: adata?.functions.filter(
                      (fdata) => fdata?._id !== inputValue?._id
                    ),
                  };
                } else {
                  return adata?.functions?.map((fdata) => {
                    if (buttonName == "View") {
                      return {
                        ...fdata,
                        views: fdata?.views.filter(
                          (vdata) => vdata?._id !== inputValue?._id
                        ),
                      };
                    } else {
                      return fdata;
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    setpersonaData({ persona: newData });

    setinputValue({
      name: "",
      pic: "",
      _id: "",
    });

    setdeleteModalShow(false);
  };
  return (
    <>
      <div className="position-relative" key={buttonName}>
        <Popover
          placement={placement}
          open={finalOpen}
          overlayClassName={!finalOpen && "d-none"}
          onOpenChange={(newOpen) => {
            if (newOpen) {
              setopen(true);
              setfinalOpen(true);
            } else {
              setopen(false);
              setTimeout(() => {
                setfinalOpen(false);
              }, 300);
            }
          }}
          arrow={false}
          style={{ width: "500px" }}
          content={
            <>
              <Collapse in={open}>
                <div className="d-flex flex-wrap">
                  {(buttonName == "Persona"
                    ? personaData?.persona
                    : buttonName == "Group"
                    ? selectedPersona?.groups
                    : buttonName == "App"
                    ? selectedGroup?.apps
                    : buttonName == "Function"
                    ? selectedApp?.functions
                    : selectedFunction?.views
                  )?.map((persona) => {
                    let profilePic = "";
                    if (persona?.pic !== "") {
                      profilePic = window.URL.createObjectURL(
                        base64ToFile(persona?.pic)
                      );
                    }
                    return (
                      <>
                        <div className="col-6 col-md-4 p-2 position-relative">
                          <div
                            className={`p-3 d-flex flex-wrap justify-content-center persona-box ${
                              (buttonName == "Persona"
                                ? selectedPersona?.name == persona?.name
                                : buttonName == "Group"
                                ? selectedGroup?.name == persona?.name
                                : buttonName == "App"
                                ? selectedApp?.name == persona?.name
                                : buttonName == "Function"
                                ? selectedFunction?.name == persona?.name
                                : selectedView?.name == persona?.name) &&
                              "active"
                            }`}
                            onClick={() => {
                              if (buttonName == "Persona") {
                                setselectedPersona(persona);
                                setselectedIds({
                                  ...selectedIds,
                                  persona: persona?._id,
                                });
                              } else if (buttonName == "Group") {
                                setselectedGroup(persona);
                                setselectedIds({
                                  ...selectedIds,
                                  group: persona?._id,
                                });
                              } else if (buttonName == "App") {
                                setselectedApp(persona);
                                setselectedIds({
                                  ...selectedIds,
                                  app: persona?._id,
                                });
                              } else if (buttonName == "Function") {
                                setselectedFunction(persona);
                                setselectedIds({
                                  ...selectedIds,
                                  function: persona?._id,
                                });
                              } else {
                                setselectedView(persona);
                                setselectedIds({
                                  ...selectedIds,
                                  view: persona?._id,
                                });
                              }
                            }}
                          >
                            <div className="profile-icon">
                              <img
                                src={profilePic}
                                onError={(e) =>
                                  (e.target.src = VimeePlaceholder)
                                }
                                className="object-fit"
                              />
                            </div>
                            <p className="persona-name m-0 p-0 mt-2 w-100 text-center">
                              {persona?.name}
                            </p>
                          </div>
                          <Dropdown
                            trigger={["click"]}
                            menu={{
                              items: [
                                {
                                  key: "1",
                                  label: (
                                    <>
                                      <div
                                        className="d-flex align-items-center"
                                        onClick={() => {
                                          setinputValue({
                                            pic: persona?.pic,
                                            name: persona?.name,
                                            _id: persona?._id,
                                          });
                                          setimage(profilePic)
                                          setmodalShow(true);
                                          seteditmode(true);
                                          setopen(false);
                                          setTimeout(() => {
                                            setfinalOpen(false);
                                          }, 300);
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          className="me-2"
                                        >
                                          <path
                                            d="M21 22H3C2.59 22 2.25 21.66 2.25 21.25C2.25 20.84 2.59 20.5 3 20.5H21C21.41 20.5 21.75 20.84 21.75 21.25C21.75 21.66 21.41 22 21 22Z"
                                            fill="#6A83A7"
                                          />
                                          <path
                                            d="M19.0201 3.48016C17.0801 1.54016 15.1801 1.49016 13.1901 3.48016L11.9801 4.69016C11.8801 4.79016 11.8401 4.95016 11.8801 5.09016C12.6401 7.74016 14.7601 9.86016 17.4101 10.6202C17.4501 10.6302 17.4901 10.6402 17.5301 10.6402C17.6401 10.6402 17.7401 10.6002 17.8201 10.5202L19.0201 9.31016C20.0101 8.33016 20.4901 7.38016 20.4901 6.42016C20.5001 5.43016 20.0201 4.47016 19.0201 3.48016Z"
                                            fill="#6A83A7"
                                          />
                                          <path
                                            d="M15.6101 11.5298C15.3201 11.3898 15.0401 11.2498 14.7701 11.0898C14.5501 10.9598 14.3401 10.8198 14.1301 10.6698C13.9601 10.5598 13.7601 10.3998 13.5701 10.2398C13.5501 10.2298 13.4801 10.1698 13.4001 10.0898C13.0701 9.8098 12.7001 9.4498 12.3701 9.0498C12.3401 9.0298 12.2901 8.9598 12.2201 8.8698C12.1201 8.7498 11.9501 8.5498 11.8001 8.3198C11.6801 8.1698 11.5401 7.9498 11.4101 7.7298C11.2501 7.4598 11.1101 7.1898 10.9701 6.9098C10.9489 6.86441 10.9284 6.81924 10.9085 6.77434C10.7609 6.44102 10.3263 6.34358 10.0685 6.60133L4.34007 12.3298C4.21007 12.4598 4.09007 12.7098 4.06007 12.8798L3.52007 16.7098C3.42007 17.3898 3.61007 18.0298 4.03007 18.4598C4.39007 18.8098 4.89007 18.9998 5.43007 18.9998C5.55007 18.9998 5.67007 18.9898 5.79007 18.9698L9.63007 18.4298C9.81007 18.3998 10.0601 18.2798 10.1801 18.1498L15.9014 12.4285C16.1609 12.1689 16.063 11.7235 15.7254 11.5794C15.6874 11.5632 15.649 11.5467 15.6101 11.5298Z"
                                            fill="#6A83A7"
                                          />
                                        </svg>{" "}
                                        Edit
                                      </div>
                                    </>
                                  ),
                                },
                                (buttonName == "Persona"
                                  ? personaData?.persona
                                  : buttonName == "Group"
                                  ? selectedPersona?.groups
                                  : buttonName == "App"
                                  ? selectedGroup?.apps
                                  : buttonName == "Function"
                                  ? selectedApp?.functions
                                  : selectedFunction?.views
                                )?.length > 1 && {
                                  key: "2",
                                  label: (
                                    <>
                                      <div
                                        className="d-flex align-items-center"
                                        onClick={() => {
                                          setdeleteModalShow(true);
                                          setinputValue({
                                            name: "",
                                            pic: "",
                                            _id: persona?._id,
                                          });
                                          setopen(false);
                                          setTimeout(() => {
                                            setfinalOpen(false);
                                          }, 300);
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          className="me-2"
                                        >
                                          <path
                                            d="M21.0699 5.23C19.4599 5.07 17.8499 4.95 16.2299 4.86V4.85L16.0099 3.55C15.8599 2.63 15.6399 1.25 13.2999 1.25H10.6799C8.34991 1.25 8.12991 2.57 7.96991 3.54L7.75991 4.82C6.82991 4.88 5.89991 4.94 4.96991 5.03L2.92991 5.23C2.50991 5.27 2.20991 5.64 2.24991 6.05C2.28991 6.46 2.64991 6.76 3.06991 6.72L5.10991 6.52C10.3499 6 15.6299 6.2 20.9299 6.73C20.9599 6.73 20.9799 6.73 21.0099 6.73C21.3899 6.73 21.7199 6.44 21.7599 6.05C21.7899 5.64 21.4899 5.27 21.0699 5.23Z"
                                            fill="#F8494C"
                                          />
                                          <path
                                            d="M19.23 8.14C18.99 7.89 18.66 7.75 18.32 7.75H5.67999C5.33999 7.75 4.99999 7.89 4.76999 8.14C4.53999 8.39 4.40999 8.73 4.42999 9.08L5.04999 19.34C5.15999 20.86 5.29999 22.76 8.78999 22.76H15.21C18.7 22.76 18.84 20.87 18.95 19.34L19.57 9.09C19.59 8.73 19.46 8.39 19.23 8.14ZM13.66 17.75H10.33C9.91999 17.75 9.57999 17.41 9.57999 17C9.57999 16.59 9.91999 16.25 10.33 16.25H13.66C14.07 16.25 14.41 16.59 14.41 17C14.41 17.41 14.07 17.75 13.66 17.75ZM14.5 13.75H9.49999C9.08999 13.75 8.74999 13.41 8.74999 13C8.74999 12.59 9.08999 12.25 9.49999 12.25H14.5C14.91 12.25 15.25 12.59 15.25 13C15.25 13.41 14.91 13.75 14.5 13.75Z"
                                            fill="#F8494C"
                                          />
                                        </svg>{" "}
                                        Delete
                                      </div>
                                    </>
                                  ),
                                },
                              ],
                            }}
                            placement="bottom"
                            arrow
                          >
                            <div
                              className="employee-menu position-absolute d-flex align-items-center justify-content-center treeDotIcon cursor-pointer"
                              style={{ top: "15px", right: "15px" }}
                            >
                              <MoreVertIcon style={{ height: "18px" }} />
                            </div>
                          </Dropdown>
                        </div>
                      </>
                    );
                  })}
                  <div className="col-6 col-md-4 p-2">
                    <div
                      className="p-3 d-flex flex-wrap justify-content-center persona-box cursor-pointer"
                      onClick={() => {
                        setmodalShow(true);
                        setopen(false);
                        setTimeout(() => {
                          setfinalOpen(false);
                        }, 300);
                      }}
                    >
                      <div
                        className="profile-icon"
                        style={{ backgroundColor: "#e2f1ff" }}
                      >
                        <img src={PlusIcon} className="object-fit" />
                      </div>
                      <p className="persona-name m-0 p-0 mt-2 w-100 text-center">
                        Create New
                      </p>
                    </div>
                  </div>
                </div>
              </Collapse>
            </>
          }
          title={<h5 className="px-2">{buttonName}s</h5>}
          trigger="click"
        >
          <button
            className="btn bottomButton me-3"
            // onClick={() => {
            //   setmodalName(buttonName);
            // }}
          >
            {icon}{" "}
            {buttonName == "Persona"
              ? selectedPersona?.name
              : buttonName == "Group"
              ? selectedGroup?.name
              : buttonName == "App"
              ? selectedApp?.name
              : buttonName == "Function"
              ? selectedFunction?.name
              : selectedView?.name}
          </button>
        </Popover>
      </div>

      <Modal
        title={""}
        centered
        open={deleteModalShow}
        onCancel={() => {
          setdeleteModalShow(false);
          // setmodalName("");
          setinputValue({
            name: "",
            pic: "",
            _id: "",
          });
        }}
        footer={""}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <h3 className="text-center">Are You Sure?</h3>
          <p className="mb-2 text-center">
            You want to delete this {buttonName}.
          </p>
          <div className="d-flex flex-wrap justify-content-center">
            <div className="col-6 col-md-4 p-2 pt-0">
              <button
                className="btn createButton cancelButton mt-4 w-100"
                type="submit"
                onClick={() => {
                  setdeleteModalShow(false);
                  // setmodalName("");
                  setinputValue({
                    name: "",
                    pic: "",
                    _id: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
            <div className="col-6 col-md-4 p-2 pt-0">
              <button
                className="btn createButton deleteButton mt-4 w-100"
                type="submit"
                onClick={() => {
                  deletePersona();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        title={`${editmode ? "Edit" : "Add"} ${buttonName}`}
        centered
        open={modalShow}
        onCancel={() => {
          setmodalShow(false);
          seteditmode(false);
          setinputValue({
            name: "",
            pic: "",
            _id: "",
          });
          setimage("");
          // setmodalName("");
        }}
        footer={""}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitCreateEvent();
          }}
        >
          <div className="d-flex justify-content-center">
            <div className="position-relative d-inline-block mt-3">
              <div
                className="profile-img-table"
                style={{
                  height: "100px",
                  width: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={image == "" ? VimeePlaceholder : image}
                  alt="profile"
                  width="100%"
                  className="object-fit"
                />
              </div>
              <div
                className="d-flex justify-content-center align-items-center position-absolute"
                style={{
                  fontSize: "18px",
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#2061c1",
                  boxShadow: "0px 4px 4px 0px rgba(32, 97, 193, 0.25)",
                  borderRadius: "50%",
                  right: "-5px",
                  bottom: "-5px",
                }}
                onClick={() => inputref.current.click()}
                role="presentation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 22H3C2.59 22 2.25 21.66 2.25 21.25C2.25 20.84 2.59 20.5 3 20.5H21C21.41 20.5 21.75 20.84 21.75 21.25C21.75 21.66 21.41 22 21 22Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M19.0201 3.48016C17.0801 1.54016 15.1801 1.49016 13.1901 3.48016L11.9801 4.69016C11.8801 4.79016 11.8401 4.95016 11.8801 5.09016C12.6401 7.74016 14.7601 9.86016 17.4101 10.6202C17.4501 10.6302 17.4901 10.6402 17.5301 10.6402C17.6401 10.6402 17.7401 10.6002 17.8201 10.5202L19.0201 9.31016C20.0101 8.33016 20.4901 7.38016 20.4901 6.42016C20.5001 5.43016 20.0201 4.47016 19.0201 3.48016Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M15.6101 11.5298C15.3201 11.3898 15.0401 11.2498 14.7701 11.0898C14.5501 10.9598 14.3401 10.8198 14.1301 10.6698C13.9601 10.5598 13.7601 10.3998 13.5701 10.2398C13.5501 10.2298 13.4801 10.1698 13.4001 10.0898C13.0701 9.8098 12.7001 9.4498 12.3701 9.0498C12.3401 9.0298 12.2901 8.9598 12.2201 8.8698C12.1201 8.7498 11.9501 8.5498 11.8001 8.3198C11.6801 8.1698 11.5401 7.9498 11.4101 7.7298C11.2501 7.4598 11.1101 7.1898 10.9701 6.9098C10.9489 6.86441 10.9284 6.81924 10.9085 6.77434C10.7609 6.44102 10.3263 6.34358 10.0685 6.60133L4.34007 12.3298C4.21007 12.4598 4.09007 12.7098 4.06007 12.8798L3.52007 16.7098C3.42007 17.3898 3.61007 18.0298 4.03007 18.4598C4.39007 18.8098 4.89007 18.9998 5.43007 18.9998C5.55007 18.9998 5.67007 18.9898 5.79007 18.9698L9.63007 18.4298C9.81007 18.3998 10.0601 18.2798 10.1801 18.1498L15.9014 12.4285C16.1609 12.1689 16.063 11.7235 15.7254 11.5794C15.6874 11.5632 15.649 11.5467 15.6101 11.5298Z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
              <input
                type="file"
                className="d-none"
                ref={inputref}
                accept="image/*"
                name="file"
                onChange={async (e) => {
                  if (e.target.files.length != 0) {
                    const url = Array.from(e.target.files);
                    const photo = url?.map((a) => {
                      return window.URL.createObjectURL(a);
                    });
                    setimage(photo);
                    const base64Images = await Promise.all(
                      (url || []).map(fileToBase64)
                    );
                    setinputValue({
                      ...inputValue,
                      pic: base64Images[0],
                    });
                  }
                }}
              />
            </div>
          </div>
          {/* <p className="mb-2 mt-4">{buttonName} Name</p> */}
          <Input
            size="large"
            className="mt-4"
            placeholder={`Enter ${buttonName} name`}
            required
            value={inputValue?.name}
            onChange={(e) => {
              setinputValue({ ...inputValue, name: e.target.value });
            }}
          />
          <div className="d-flex justify-content-center">
            <button className="btn createButton mt-4" type="submit">
              {`${editmode ? "Edit" : "Create"} ${buttonName}`}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BottomPopupViewWithButton;
