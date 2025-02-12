import PropTypes from 'prop-types';

export const metadata = {
    title: 'Coder XYZ',
    description: 'Coder xyz is a social network platform for developers.',
  }

export default function RootLayout({ children }) {
    return (
      <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
    )
  }

    
  RootLayout.propTypes = {
    children: PropTypes.node.isRequired,
  }; 