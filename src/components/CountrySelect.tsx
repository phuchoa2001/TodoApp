import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { MenuItem, Select, SelectChangeEvent, FormLabel, FormGroup } from "@mui/material";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { VN, GB } from 'country-flag-icons/react/3x2';

interface CountryItem {
  label: string;
  icon: React.ReactNode;
  value: string;
}

function CountrySelect() {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useContext(UserContext);
  const [languages, setLanguages] = useState<String>(user.settings[0].languages);

  const countryList: CountryItem[] = [
    { label: t("languages.en"), icon: <StyledGB />, value: "en" },
    { label: t("languages.vi"), icon: <StyledVN />, value: "vi" }
  ];

  const handleEmojiStyleChange = (event: SelectChangeEvent<unknown>) => {
    const languages = event.target.value as string;
    setLanguages(languages)
    setUser((prevUser) => ({
      ...prevUser,
      settings: [{
        ...prevUser.settings[0],
        languages
      }],
    }));
    i18n.changeLanguage(languages);
  };

  return (
    <FormGroup>
      <FormLabel>Language</FormLabel>
      <StyledSelect
        value={languages}
        onChange={handleEmojiStyleChange}
        translate="no"
      >
        {countryList.map((item) => (
          <MenuItem
            key={item.label}
            value={item.value}
            translate="no"
            sx={{
              padding: "12px 20px",
              borderRadius: "12px",
              margin: "0 8px",
              display: "flex",
              gap: "4px",
            }}
          >
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormGroup>
  );
}

const StyledGB = styled(GB)`
  width: 30px;
  height: 30px;
`;

const StyledVN = styled(VN)`
  width: 30px;
  height: 30px;
`;

const StyledSelect = styled(Select)`
  width: 330px;
  color: black;
  margin: 8px 0;
`;

export default CountrySelect;