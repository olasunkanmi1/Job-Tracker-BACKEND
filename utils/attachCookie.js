const attachCookie = ({ res, token }) => {
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    // secure: process.env.NODE_ENV === 'production',
    secure: true,
    sameSite: 'none',
    domain: 'https://trackyourjobs.vercel.app/'
  })
  res.send()
};

export default attachCookie;