import React from 'react';
import { Link } from 'react-router-dom';

import Wrapper from './Wrapper';

const LeftMenuHeader = () => (
  <Wrapper className="test">
    {/*<Link to="/">*/}
    {/*  <span className="projectName" />*/}
    {/*</Link>*/}
      <div style={{color: "white", fontSize: 'large'}}>My Content</div>
  </Wrapper>
);

export default LeftMenuHeader;
