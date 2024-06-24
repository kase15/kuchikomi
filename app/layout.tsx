import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
