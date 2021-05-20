import React from 'react';
import { Link } from 'react-router-dom';

import Wrapper from './Wrapper';

const LeftMenuHeader = () => (
  <Wrapper>
    {/*<Link to="/">*/}
    {/*  <span className="projectName" />*/}
    {/*</Link>*/}
    <div style={{display: "flex", alignItems: 'center'}}>
      <div style={{color: "white", fontSize: 'large'}}>My Content</div>
    </div>

  </Wrapper>
);

export default LeftMenuHeader;
