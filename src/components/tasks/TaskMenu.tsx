import {
  Cancel,
  Close,
  ContentCopy,
  ContentCopyRounded,
  DeleteRounded,
  Done,
  DownloadRounded,
  EditRounded,
  IosShare,
  LaunchRounded,
  LinkRounded,
  Pause,
  PlayArrow,
  PushPinRounded,
  QrCode2Rounded,
  RadioButtonChecked,
  RecordVoiceOver,
  RecordVoiceOverRounded,
} from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import styled from "@emotion/styled";
import "react-spring-bottom-sheet/dist/style.css";
import { useResponsiveDisplay } from "../../hooks/useResponsiveDisplay";
import { ColorPalette, DialogBtn } from "../../styles";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../contexts/UserContext";
import QRCode from "react-qr-code";
import { Task, UUID } from "../../types/user";
import { calculateDateDifference, saveQRCode, showToast } from "../../utils";
import Marquee from "react-fast-marquee";
import { TaskIcon } from "..";
import { useTranslation } from "react-i18next";

interface TaskMenuProps {
  selectedTaskId: UUID | null;
  selectedTasks: UUID[];
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: null | HTMLElement;
  handleDeleteTask: () => void;
  handleCloseMoreMenu: () => void;
  handleSelectTask: (taskId: UUID) => void;
}

export const TaskMenu: React.FC<TaskMenuProps> = ({
  selectedTaskId,
  selectedTasks,
  setEditModalOpen,
  anchorEl,
  handleDeleteTask,
  handleCloseMoreMenu,
  handleSelectTask,
}) => {
  const { user, setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const { tasks, name, settings, emojisStyle } = user;
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const [shareTabVal, setShareTabVal] = useState<number>(0);
  const isMobile = useResponsiveDisplay();
  const n = useNavigate();

  const redirectToTaskDetails = () => {
    const selectedTask = tasks.find((task) => task.id === selectedTaskId);
    const taskId = selectedTask?.id.toString().replace(".", "");
    n(`/task/${taskId}`);
  };

  const generateShareableLink = (taskId: UUID | null, userName: string): string => {
    const task = tasks.find((task) => task.id === taskId);

    // This removes id property from link as a new identifier is generated on the share page.
    interface TaskToShare extends Omit<Task, "id"> {
      id: undefined;
    }

    if (task) {
      const taskToShare: TaskToShare = {
        ...task,
        sharedBy: undefined,
        id: undefined,
        category: settings[0].enableCategories ? task.category : undefined,
      };
      const encodedTask = encodeURIComponent(JSON.stringify(taskToShare));
      const encodedUserName = encodeURIComponent(userName);
      return `${window.location.href}share?task=${encodedTask}&userName=${encodedUserName}`;
    }
    return "";
  };

  const handleCopyToClipboard = async (): Promise<void> => {
    const linkToCopy = generateShareableLink(selectedTaskId, name || "User");
    try {
      await navigator.clipboard.writeText(linkToCopy);
      showToast(t('task.copiedLink'));
    } catch (error) {
      console.error(t('task.copyError'), error);
      showToast(t('task.copyError'), { type: "error" });
    }
  };

  const handleShare = async (): Promise<void> => {
    const linkToShare = generateShareableLink(selectedTaskId, name || "User");
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('task.shareTask'),
          text: `${t('task.shareTaskText')}${tasks.find((task) => task.id === selectedTaskId)?.name}`,
          url: linkToShare,
        });
      } catch (error) {
        console.error(t('task.shareError'), error);
      }
    }
  };

  const handleMarkAsDone = () => {

    // Toggles the "done" property of the selected task
    if (selectedTaskId) {
      handleCloseMoreMenu();
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, done: !task.done };
        }
        return task;
      });
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));

      const allTasksDone = updatedTasks.every((task) => task.done);

      if (allTasksDone) {
        showToast(
          <div>
            <b>{t('task.allTasksDoneTitle')}</b>
            <br />
            <span>{t('task.allTasksDoneMessage')}</span>
          </div>,
          {
            icon: (
              <div style={{ margin: "-6px 4px -6px -6px" }}>
                <TaskIcon variant="success" scale={0.18} />
              </div>
            ),
          }
        );
      }
    }
  };

  const handlePin = () => {
    // Toggles the "pinned" property of the selected task
    if (selectedTaskId) {
      handleCloseMoreMenu();
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return { ...task, pinned: !task.pinned };
        }
        return task;
      });
      setUser((prevUser) => ({
        ...prevUser,
        tasks: updatedTasks,
      }));
    }
  };

  const handleDuplicateTask = () => {
    handleCloseMoreMenu();
    if (selectedTaskId) {
      // Find the selected task
      const selectedTask = tasks.find((task) => task.id === selectedTaskId);
      if (selectedTask) {
        // Create a duplicated task with a new ID and current date
        const duplicatedTask: Task = {
          ...selectedTask,
          id: crypto.randomUUID(),
          date: new Date(),
          lastSave: undefined,
        };
        // Add the duplicated task to the existing tasks
        const updatedTasks = [...tasks, duplicatedTask];
        // Update the user object with the updated tasks
        setUser((prevUser) => ({
          ...prevUser,
          tasks: updatedTasks,
        }));
      }
    }
  };

  const handleReadAloud = () => {
    const selectedTask = tasks.find((task) => task.id === selectedTaskId);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((voice) => voice.name === settings[0].voice);
    const voiceName = voices.find((voice) => voice.name === settings[0].voice);
    const voiceVolume = settings[0].voiceVolume;
    const taskName = selectedTask?.name || "";
    const taskDescription =
      selectedTask?.description?.replace(/((?:https?):\/\/[^\s/$.?#].[^\s]*)/gi, "[link]") || "";
    // Read task date in voice language

    const taskDate = new Intl.DateTimeFormat(voice ? voice.lang : navigator.language, {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(selectedTask?.date || ""));

    const taskDeadline = selectedTask?.deadline
      ? `. ${t('task.taskDeadline')}: ` +
      calculateDateDifference(
        new Date(selectedTask.deadline) || "",
        voice ? voice.lang : navigator.language // Read task deadline in voice language
      )
      : "";

    const textToRead = `${taskName}. ${taskDescription}. ${t('task.date')}: ${taskDate}${taskDeadline}`;

    const utterThis: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(textToRead);

    if (voiceName) {
      utterThis.voice = voiceName;
    }

    if (voiceVolume) {
      utterThis.volume = voiceVolume;
    }

    handleCloseMoreMenu();

    const pauseSpeech = () => {
      window.speechSynthesis.pause();
    };

    const resumeSpeech = () => {
      window.speechSynthesis.resume();
    };

    const cancelSpeech = () => {
      window.speechSynthesis.cancel();
      toast.dismiss(SpeechToastId);
      handleCloseMoreMenu();
    };

    const SpeechToastId = toast(
      () => {
        const [isPlaying, setIsPlaying] = useState<boolean>(true);
        return (
          <ReadAloudContainer>
            <ReadAloudHeader translate="yes">
              <RecordVoiceOver /> {t('task.readAloud')}: <span translate="no">{selectedTask?.name}</span>
            </ReadAloudHeader>
            <span translate="yes" style={{ marginTop: "8px", fontSize: "16px" }}>
              {t('task.voice')}: <span translate="no">{utterThis.voice?.name || t('task.defaultVoice')}</span>
            </span>
            <div translate="no">
              <Marquee delay={0.6} play={isPlaying}>
                <p style={{ margin: "6px 0" }}>{utterThis.text} &nbsp;</p>
              </Marquee>
            </div>
            <ReadAloudControls>
              {isPlaying ? (
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    pauseSpeech();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <Pause fontSize="large" />
                </IconButton>
              ) : (
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    resumeSpeech();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <PlayArrow fontSize="large" />
                </IconButton>
              )}

              <IconButton sx={{ color: "white" }} onClick={cancelSpeech}>
                <Cancel fontSize="large" />
              </IconButton>
            </ReadAloudControls>
          </ReadAloudContainer>
        );
      },
      {
        duration: 999999999,
        style: {
          border: "1px solid #1b1d4eb7",
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)",
        },
      }
    );

    // Set up event listener for the end of speech
    utterThis.onend = () => {
      // Close the menu
      handleCloseMoreMenu();
      // Hide the toast when speech ends
      toast.dismiss(SpeechToastId);
    };
    if (voiceVolume > 0) {
      window.speechSynthesis.speak(utterThis);
    }
  };

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  const menuItems: JSX.Element = (
    <div>
      <StyledMenuItem onClick={handleMarkAsDone}>
        {selectedTask?.done ? <Close /> : <Done />}
        &nbsp;{" "}
        {selectedTask?.done
          ? t('task.markAsNotDone')
          : t('task.markAsDone')}
      </StyledMenuItem>
      <StyledMenuItem onClick={handlePin}>
        <PushPinRounded sx={{ textDecoration: "line-through" }} />
        &nbsp; {selectedTask?.pinned ? t('task.unpin') : t('task.pin')}
      </StyledMenuItem>

      {selectedTasks.length === 0 && (
        <StyledMenuItem onClick={() => handleSelectTask(selectedTaskId || crypto.randomUUID())}>
          <RadioButtonChecked /> &nbsp; {t('task.select')}
        </StyledMenuItem>
      )}

      <StyledMenuItem onClick={redirectToTaskDetails}>
        <LaunchRounded /> &nbsp; {t('task.taskDetails')}
      </StyledMenuItem>

      {settings[0].enableReadAloud && (
        <StyledMenuItem
          onClick={handleReadAloud}
          disabled={window.speechSynthesis.speaking || window.speechSynthesis.pending}
        >
          <RecordVoiceOverRounded /> &nbsp; {t('task.readAloud')}
        </StyledMenuItem>
      )}

      <StyledMenuItem
        onClick={() => {
          setShowShareDialog(true);
          handleCloseMoreMenu();
        }}
      >
        <LinkRounded /> &nbsp; {t('task.share')}
      </StyledMenuItem>

      <Divider />
      <StyledMenuItem
        onClick={() => {
          setEditModalOpen(true);
          handleCloseMoreMenu();
        }}
      >
        <EditRounded /> &nbsp; {t('task.edit')}
      </StyledMenuItem>
      <StyledMenuItem onClick={handleDuplicateTask}>
        <ContentCopy /> &nbsp; {t('task.duplicate')}
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem
        clr={ColorPalette.red}
        onClick={() => {
          handleDeleteTask();
          handleCloseMoreMenu();
        }}
      >
        <DeleteRounded /> &nbsp; {t('task.delete')}
      </StyledMenuItem>
    </div>
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setShareTabVal(newValue);
  };
  return (
    <>
      {isMobile ? (
        <BottomSheet
          open={Boolean(anchorEl)}
          onDismiss={handleCloseMoreMenu}
          snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
          expandOnContentDrag
          onClick={() => console.log("xd")}
          header={
            <SheetHeader translate="no">
              <Emoji
                emojiStyle={emojisStyle}
                size={32}
                unified={tasks.find((task) => task.id === selectedTaskId)?.emoji || ""}
              />{" "}
              {emojisStyle === EmojiStyle.NATIVE && "\u00A0 "}
              {tasks.find((task) => task.id === selectedTaskId)?.name}
            </SheetHeader>
          }
        >
          <SheetContent>{menuItems}</SheetContent>
        </BottomSheet>
      ) : (
        <Menu
          id="task-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMoreMenu}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "18px",
              minWidth: "200px",
              boxShadow: "none",
              padding: "6px 4px",
            },
          }}
          MenuListProps={{
            "aria-labelledby": "more-button",
          }}
        >
          {menuItems}
        </Menu>
      )}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        PaperProps={{
          style: {
            borderRadius: "28px",
            padding: "10px",
            width: "560px",
          },
        }}
      >
        <DialogTitle>{t('task.shareTask')}</DialogTitle>
        <DialogContent>
          <span>
            {t('task.shareTaskLabel')}
            <b translate="no">{selectedTask?.name}</b>
          </span>
          <Tabs value={shareTabVal} onChange={handleTabChange} sx={{ m: "8px 0" }}>
            <StyledTab label={t('task.link')} icon={<LinkRounded />} />
            <StyledTab label={t('task.qrCode')} icon={<QrCode2Rounded />} />
          </Tabs>
          <CustomTabPanel value={shareTabVal} index={0}>
            <ShareField
              value={generateShareableLink(selectedTaskId, name || "User")}
              fullWidth
              variant="outlined"
              label={t('task.shareableLink')}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkRounded sx={{ ml: "8px" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={handleCopyToClipboard}
                      sx={{ p: "12px", borderRadius: "14px", mr: "4px" }}
                    >
                      <ContentCopyRounded /> &nbsp; {t('task.copy')}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                mt: 3,
              }}
            />
          </CustomTabPanel>
          <CustomTabPanel value={shareTabVal} index={1}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "22px",
              }}
            >
              <QRCode
                id="QRCodeShare"
                value={generateShareableLink(selectedTaskId, name || "User")}
                size={400}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DownloadQrCodeBtn
                variant="outlined"
                onClick={() => saveQRCode(selectedTask?.name || "")}
              >
                <DownloadRounded /> &nbsp; {t('task.downloadQRCode')}
              </DownloadQrCodeBtn>
            </Box>
          </CustomTabPanel>
          <Alert severity="info" sx={{ mt: "20px" }}>
            <AlertTitle>{t('task.shareYourTask')}</AlertTitle>
            {t('task.shareYourTaskDescription')}
          </Alert>
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setShowShareDialog(false)}>{t('task.close')}</DialogBtn>
          <DialogBtn onClick={handleShare}>
            <IosShare sx={{ mb: "4px" }} /> &nbsp; {t('task.share')}
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  );
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const CustomTabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`share-tabpanel-${index}`}
      aria-labelledby={`share-tab-${index}`}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
const SheetHeader = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  color: ${ColorPalette.fontDark};
  margin: 10px;
  font-size: 20px;
`;

const SheetContent = styled.div`
  color: ${ColorPalette.fontDark};
  margin: 20px 10px;
  & .MuiMenuItem-root {
    font-size: 16px;
    padding: 16px;
    &::before {
      content: "";
      display: inline-block;
      margin-right: 10px;
    }
  }
`;
const StyledMenuItem = styled(MenuItem) <{ clr?: string }>`
  margin: 0 6px;
  padding: 12px;
  border-radius: 12px;
  box-shadow: none;
  gap: 2px;
  color: ${({ clr }) => clr || ColorPalette.fontDark};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ReadAloudContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ReadAloudHeader = styled.div`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  gap: 6px;
`;

const ReadAloudControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 8px;
`;

const ShareField = styled(TextField)`
  margin-top: 22px;
  .MuiOutlinedInput-root {
    border-radius: 14px;
    padding: 2px;
    transition: 0.3s all;
  }
`;

const DownloadQrCodeBtn = styled(Button)`
  padding: 12px 24px;
  border-radius: 14px;
  margin-top: 16px;
  @media (max-width: 520px) {
    margin-top: -2px;
  }
`;

const StyledTab = styled(Tab)`
  border-radius: 12px 12px 0 0;
  width: 50%;
  .MuiTabs-indicator {
    border-radius: 24px;
  }
`;
StyledTab.defaultProps = {
  iconPosition: "start",
};
