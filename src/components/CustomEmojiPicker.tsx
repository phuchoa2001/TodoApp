import { useState, useEffect, Dispatch, SetStateAction } from "react";
import styled from "@emotion/styled";
import { Avatar, Badge, Tooltip } from "@mui/material";
import { AddReaction, Edit } from "@mui/icons-material";
import EmojiPicker, { Emoji, EmojiStyle } from "emoji-picker-react";
import { getFontColorFromHex } from "../utils";
import { ColorPalette } from "../styles";

interface EmojiPickerProps {
  emoji?: string;
  setEmoji: Dispatch<SetStateAction<string | undefined>>;
  emojiStyle: EmojiStyle;
  color?: string;
}

export const CustomEmojiPicker = ({
  emoji,
  setEmoji,
  emojiStyle,
  color,
}: EmojiPickerProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | undefined>(
    emoji || undefined
  );

  useEffect(() => {
    setEmoji(currentEmoji);
  }, [currentEmoji]);

  useEffect(() => {
    if (emoji === "") {
      setCurrentEmoji(undefined);
    }
  }, [emoji]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (e: { unified: string }) => {
    setShowEmojiPicker(!showEmojiPicker);
    setCurrentEmoji(e.unified);
  };

  const renderAvatarContent = () => {
    if (emoji || currentEmoji) {
      return (
        <Emoji size={64} emojiStyle={emojiStyle} unified={currentEmoji || ""} />
      );
    } else {
      return (
        <AddReaction
          sx={{
            fontSize: "52px",
            color: color ? getFontColorFromHex(color) : ColorPalette.fontLight,
          }}
        />
      );
    }
  };

  return (
    <>
      <EmojiContainer>
        <Tooltip title={currentEmoji ? "Change Emoji" : "Choose an emoji"}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                sx={{
                  background: "#9c9c9c81",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                }}
                onClick={toggleEmojiPicker}
              >
                <Edit />
              </Avatar>
            }
          >
            <Avatar
              onClick={toggleEmojiPicker}
              sx={{
                width: "96px",
                height: "96px",
                background: color || ColorPalette.purple,
                cursor: "pointer",
              }}
            >
              {renderAvatarContent()}
            </Avatar>
          </Badge>
        </Tooltip>
      </EmojiContainer>
      {showEmojiPicker && (
        <EmojiPickerContainer>
          <EmojiPicker
            emojiStyle={emojiStyle}
            lazyLoadEmojis
            onEmojiClick={handleEmojiClick}
          />
        </EmojiPickerContainer>
      )}
    </>
  );
};

const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px;
`;

const EmojiPickerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
`;
