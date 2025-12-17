export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);



// prima database errors when attenpting to cretae duplicate db records

if (err.code === 'P2002') {
    return res.status(400).json({
        success: false,
        message: ' A record with this value already exists.'
    })




}

// record not found

if (err.code === 'P2025'){
    return res.status(404).json({
        success: false,
        message: 'Record not found'

    })
}


// invalid authentiication tokens
if(err.name === 'JsonWebTokenError'){
    return res.status(401).json({
        sucess: false,
        message: 'Invalid token'
    })
}



// valid but expired authentication token 


if (err.name === 'TokenExpiredError') {
  return res.status(401).json({
    success: false,
    message: 'Token expired'
  });
}



// invalid user input data that fails validation checks

if (err.name === 'ValidationError'){
    return res.status(400).json({
        success: false,
        messsage: err.message
    })
}


// default error uses :
// error-specific status code if provided
// defaults to 500 internal server error if unspecified

res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack

    })

})
}