const errorHandling= (err ,req , res, next)=>{
  console.log(err.stack);
  res.status(500).json({
    sucess:false,
    status:500,
    message : "Something went wrong",
    error:err.message
  })
  
}

export default errorHandling;