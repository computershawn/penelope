import styled from 'styled-components'
import { Button } from '../StyledUiCommon/styles';

export const InputContainer = styled.div`
  input {
    height: 1.875rem;
    font-size: 1rem;
    flex-grow: 1;
    width: ${(props) => props.fieldWidth}rem;
    margin-top: 0.375rem;
    padding-left: 0.375rem;
    border-radius: 2px;
    border-width: 1px;
    border-top-color: rgba(107, 0, 255, 0.32);
    border-bottom-color: rgba(107, 0, 255, 0.32);
    border-left-color: rgba(107, 0, 255, 0.32);
    border-right-color: rgba(107, 0, 255, 0.32);

    &:focus-visible {
      outline-color: rgba(107, 0, 255, 0.64);
      outline-width: 1px;
      outline-style: inset;
    }
  }

  &:nth-child(2) {   
    padding-left: 0.75rem;
  }
`;

export const InputsWrapper = styled.div`
  display: flex;

  & > p.field-error {
    color: orange;
    font-size: 48px;
  }
`;

export const StyledButton = styled(Button)`
  margin-top: 0.75rem;
`;