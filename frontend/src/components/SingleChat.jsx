import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../helpers";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import "./style.css";
import animationData from "../typing.json";
import Lottie from "react-lottie";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//   const { user, setSelectedChat, selectedChat } = ChatState();
//   const toast = useToast();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newMessage, setNewMessage] = useState();
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   useEffect(() => {
//     socket = io(ENDPOINT);
//     console.log(socket, "ooooopppppp");
//     socket.emit("setup", user);
//     socket.on("connected", () => {
//       console.log("hello i am connected");
//       setSocketConnected(true);
//     });
//     socket.on("typing", () => setTyping(true));
//     socket.on("stop typing", () => setTyping(true));
//     console.log(socket, "lllllllllll");
//   }, []);

//   const sendMessage = async (e) => {
//     if (e.key === "Enter" && newMessage !== "") {
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         setNewMessage("");
//         const { data } = await axios.post(
//           "/api/message",
//           {
//             content: newMessage,
//             chatID: selectedChat._id,
//           },
//           config
//         );
//         setMessages([...messages, data]);
//         console.log(data, "datadatadatadatadatadatadata");
//         socket.emit("new message", data);
//       } catch (error) {
//         toast({
//           title: "Error Occured!",
//           description: "Failed to send the Message",
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//           position: "bottom",
//         });
//       }
//     }
//   };

//   const typingHandler = (e) => {
//     setNewMessage(e.target.value);

//     if (!socketConnected) return;

//     if (!typing) {
//       setTyping(true);
//       socket.emit("typing", selectedChat._id);
//     }

//     let lastTypingTime = new Date().getTime();
//     var timerLength = 3000;
//     setTimeout(() => {
//       var timeNow = new Date().getTime();
//       var timeDiff = timeNow - lastTypingTime;
//       if (timeDiff >= timerLength && typing) {
//         socket.emit("stop typing", selectedChat._id);
//         setTyping(false);
//       }
//     }, timerLength);
//   };

//   const fetchMessages = async () => {
//     if (!selectedChat) return;

//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       setLoading(true);

//       const { data } = await axios.get(
//         `/api/message/${selectedChat._id}`,
//         config
//       );
//       setMessages(data);
//       setLoading(false);
//       socket.emit("join chat", selectedChat._id);
//       console.log("ooooopppppp", socket, selectedChatCompare);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the Messages",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//     selectedChatCompare = selectedChat;
//     console.log(selectedChat, "1111111111111111");
//   }, [selectedChat]);

//   useEffect(() => {
//     socket.on("message received", (newMessageReceived) => {
//       console.log(
//         // newMessageReceived,
//         "33333333333333333",
//         selectedChatCompare,
//         selectedChat
//         // newMessageReceived.chat
//       );
//       if (
//         !selectedChatCompare ||
//         selectedChatCompare._id !== newMessageReceived.chat._id
//       ) {
//         // notification
//       } else {
//         console.log(messages, "444444444444444", newMessageReceived);
//         const copy = JSON.parse(JSON.stringify(messages));
//         setMessages([...copy, newMessageReceived]);
//       }
//     });
//   }, [selectedChat]);

//   return selectedChat ? (
//     <>
//       {" "}
//       <Text
//         fontSize={{ base: "28px", md: "30px" }}
//         pb={3}
//         px={2}
//         w="100%"
//         fontFamily="Work sans"
//         display="flex"
//         justifyContent={{ base: "space-between" }}
//         alignItems="center"
//       >
//         <IconButton
//           display={{ base: "flex", md: "none" }}
//           icon={<ArrowBackIcon />}
//           onClick={() => setSelectedChat("")}
//         />
//         {!selectedChat.isGroupChat ? (
//           <>
//             {getSender(user, selectedChat.users)}
//             <ProfileModal user={getSenderFull(user, selectedChat.users)} />
//           </>
//         ) : (
//           <>
//             {selectedChat.chatName.toUpperCase()}
//             <UpdateGroupChatModal
//               fetchAgain={fetchAgain}
//               setFetchAgain={setFetchAgain}
//               fetchMessages={fetchMessages}
//             />
//           </>
//         )}
//       </Text>
//       <Box
//         display="flex"
//         flexDir="column"
//         justifyContent="flex-end"
//         p={3}
//         bg="#E8E8E8"
//         w="100%"
//         h="100%"
//         borderRadius="lg"
//         overflowY="hidden"
//       >
//         {loading ? (
//           <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
//         ) : (
//           <div className="messages">
//             <ScrollableChat messages={messages} />
//           </div>
//         )}

//         <FormControl onKeyDown={sendMessage} isRequire mt={3}>
//           {isTyping ? <>Loading....</> : <></>}
//           <Input
//             variant="filled"
//             bg="#E0E0E0"
//             placeholder="Enter a message.."
//             value={newMessage}
//             onChange={typingHandler}
//           />
//         </FormControl>
//       </Box>
//     </>
//   ) : (
//     <Box display="flex" alignItems="center" justifyContent="center" h="100%">
//       <Text fontSize="3xl" pb={3} fontFamily="Work sans">
//         Click on a user to start chatting
//       </Text>
//     </Box>
//   );
// };

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatID: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    console.log("hiiiiiillllll");
    socket.on("message received", (newMessageRecieved) => {
      console.log(
        // newMessageReceived,
        "33333333333333333"
        // selectedChatCompare,
        // selectedChat
        // newMessageReceived.chat
      );
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
