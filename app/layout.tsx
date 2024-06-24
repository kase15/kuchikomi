import React from 'react';

const Layout = ({ children }) => {
  return (
    <html>
      <head>
        <title>Google Business Info Fetcher</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};

export default Layout;
