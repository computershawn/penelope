import { useContext, useState } from 'react';
import { createClient } from 'contentful-management';
// import Image from 'next/image';

import { ClearBtn, IconButton, NavSection, OutlineBtn, PanelSectionHeading } from '../StyledUiCommon/styles';
import { ExplorerGrid } from './styles';
import { fetchAxiSvgContent, getFromLocalStorage, plot, saveToLocalStorage } from '../../utils';
import { store } from '../../providers/store';
import ImageBlock from '../ImageCard';
import Uploader from '../Uploader';
import { PlugIcon } from '../Icons';

const SvgExplorer = ({ goToConnect, handleSelect, title }) => {
  const globalState = useContext(store);
  const { dispatch, state: { axiConnection, currentEntryIndex, entries, isConnected } } = globalState;
  const [uploaderIsOpen, setUploaderIsOpen] = useState(false);

  const initDelete = async (index) => {
    const credentialsLocalStorage = getFromLocalStorage('contentfulCreds');
    if (!credentialsLocalStorage) {
      return;
    }

    const entryId = entries[index].id;
    const svgId = entries[index].images.svg.id;
    const thumbnailId = entries[index].images.thumbnail.id;

    const { accessToken, spaceId } = credentialsLocalStorage;
    const client = createClient({ accessToken });
    const space = await client.getSpace(spaceId);

    await space.getEnvironment('master')
      .then((environment) => environment.getEntry(entryId))
      .then((entry) => entry.unpublish())
      .then((entry) => entry.delete())
      .catch(console.error)    

    await space.getEnvironment('master')
      .then((environment) => environment.getAsset(thumbnailId))
      .then((asset) => asset.unpublish())
      .then((asset) => asset.delete())
      .catch(console.error)

    await space.getEnvironment('master')
      .then((environment) => environment.getAsset(svgId))
      .then((asset) => asset.unpublish())
      .then((asset) => asset.delete())
      .catch(console.error)

    console.log(`Entry ${entryId} and its assets were unpublished and deleted.`);
    const data = await fetchAxiSvgContent(space);

    // Save content into local storage
    saveToLocalStorage('axiSvgContent', data);

    // Save content to store
    dispatch({
      type: 'SET_ENTRIES_DATA',
      payload: {
        data,
      },
    });
  }

  const blankHeightStyle = isConnected ? {} : { height: '8rem' };

  return (
    <>
      {uploaderIsOpen && <Uploader dismiss={() => setUploaderIsOpen(false)} />}
      <NavSection className="gallery-section-header">
        <PanelSectionHeading>{title}</PanelSectionHeading>
        <OutlineBtn onClick={() => setUploaderIsOpen(true)}>Upload a New SVG</OutlineBtn>
      </NavSection>
      <NavSection className="main-area gallery">
        <ExplorerGrid>
          {entries.map((data, index) => (
            <ImageBlock
              key={data.images.thumbnail.id}
              imageData={data}
              handleClick={() => handleSelect(index)}
              initDelete={() => initDelete(index)}
              isActive={index === currentEntryIndex}
            />
          ))}
        </ExplorerGrid>
      </NavSection>
      <NavSection className="gallery-cta-footer" style={blankHeightStyle}>
        {isConnected && (
          <IconButton className="cta" variant="alternate" onClick={() => plot(entries[currentEntryIndex], axiConnection)} wide>
              <PlugIcon width={24} height={24} fill='#fff' />
              <span>Plot It!</span>
          </IconButton>
        )}
        {isConnected ? (
          <IconButton className="cta" variant="alternate" onClick={() => plot(entries[currentEntryIndex], axiConnection)} wide>
              <PlugIcon width={24} height={24} fill='#fff' />
              <span>Plot It!</span>
          </IconButton>
        ): (
          <p className="blurb">To begin plotting, <ClearBtn onClick={goToConnect}>connect to AxiDraw</ClearBtn>.</p>
        )}
      </NavSection>
    </>
  )
};

export default SvgExplorer;