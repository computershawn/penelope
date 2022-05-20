import { useState } from "react";
import Image from 'next/image';

import { Button, ClearBtn, Input } from "../StyledUiCommon/styles";
import { ButtonInlineText, CredentialsBox, MoreInfoBox, Welcome } from "./styles";


const MoreInfo = ({ show, infoBoxOpen }) => {
  return (
    <MoreInfoBox infoBoxOpen={infoBoxOpen}>
      <div>
        <div className="more-info-header">
          <ClearBtn onClick={show}>
            <Image alt="temp" src={"/icn-square.svg"} width={24} height={24} />
          </ClearBtn>
        </div>
        <div>
          <p>
            Hello there, lovely human. Welcome to Penelope, AxiDraw&apos;s
            missing interface. You&apos;re free to use this app if you
            don&apos;t have an{" "}
            <a
              href="https://shop.evilmadscientist.com/productsmenu/846"
              target="_blank"
              rel="noreferrer"
            >
              AxiDraw
            </a>{" "}
            pen plotter. BUT! If you don&apos;t have access to an AxiDraw,
            Penelope might not be of much use to you.
          </p>
          <p>
            Still there? Fantastic. Penelope is a GUI on top of the{" "}
            <a
              href="https://axidraw.com/doc/py_api/#introduction"
              target="_blank"
              rel="noreferrer"
            >
              AxiDraw Python API
            </a>
            . While{" "}
            <a href="https://inkscape.org/" target="_blank" rel="noreferrer">
              Inkscape
            </a>{" "}
            has an extension for plotting from AxiDraw, it&apos;s not very fun
            to use. Penelope has some of the same functionality as the Inkscape
            extension and the AxiDraw API / CLI.
          </p>
          <p>
            A couple of things before we get started: First, you&apos;ll need to
            get a personal access token and space ID from Contentful.{" "}
            <a
              href="https://www.contentful.com/help/personal-access-tokens/#how-to-get-a-personal-access-token-the-web-app"
              target="_blank"
              rel="noreferrer"
            >
              Click here
            </a>{" "}
            to learn about how to set that up. You&apos;ll also need to download
            and run the{" "}
            <a href="" target="_blank">
              Penelope Python app
            </a>{" "}
            on your computer.
          </p>
        </div>
      </div>
    </MoreInfoBox>
  );
};

const AuthView = ({
  attemptSignIn,
  isSigningIn,
  fieldCreds,
  handleChangeInput,
}) => {
  const SPACE_ID = "spaceId";
  const TOKEN = "accessToken";

  const [blanks, setBlanks] = useState({
    [TOKEN]: false,
    [SPACE_ID]: false,
  });

  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const tokenError = fieldCreds.errors[TOKEN];
  const spaceError = fieldCreds.errors[SPACE_ID];

  const doHandleChangeInput = (e) => {
    const isBlank = e.target.value.trim() === "";
    setBlanks({
      ...blanks,
      [e.target.name]: isBlank,
    });
    handleChangeInput(e);
  };

  const anyBlankFields = blanks[TOKEN] || blanks[SPACE_ID];

  return (
    <Welcome isOpen={showMoreInfo}>
      <CredentialsBox infoBoxOpen={showMoreInfo}>
        <div className="ui-container">
          <div className="logo-container">
            <h1 style={{ margin: 0 }}>🌮 penelope ~ logo 🍕</h1>
          </div>
          <p className="form-description">Enter your personal access token and space ID</p>
          <section>
            <Input
              placeholder="your-personal-access-token"
              onChange={doHandleChangeInput}
              value={fieldCreds.values[TOKEN]}
              name="accessToken"
              disabled={isSigningIn}
            />
            {tokenError && <p className="input-field-error">{tokenError}</p>}
          </section>
          <section>
            <Input
              placeholder="your-space-ID"
              onChange={doHandleChangeInput}
              value={fieldCreds.values[SPACE_ID]}
              name="spaceId"
              disabled={isSigningIn}
            />
            {spaceError && <p className="input-field-error">{spaceError}</p>}
            {anyBlankFields && (
              <p className="input-field-error">
                Please enter both an access token and a space ID
              </p>
            )}
          </section>

          <Button
            className="login-button"
            onClick={() => attemptSignIn(fieldCreds)}
            disabled={isSigningIn || anyBlankFields}
            variant="alternate"
            wide
          >
            Let&apos;s Begin
          </Button>

          <p className="input-field-hint">
            Not sure what the heck this is?{" "}
            <ButtonInlineText onClick={() => setShowMoreInfo(true)}>Click here for info</ButtonInlineText>
            .
          </p>
        </div>
      </CredentialsBox>
      <MoreInfo show={() => setShowMoreInfo(false)} infoBoxOpen={showMoreInfo} />
    </Welcome>
  );
};

export default AuthView;