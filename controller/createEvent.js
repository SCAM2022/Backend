const Event = require('../models/createEvent');


exports.postCreateEvent = async(req,res,next) => {
    //console.log(req. body);
  
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
    const title = obj.title;
    const category = obj.category;
    const discription = obj.discription;
    const startDate = obj.startDate;
    const endDate = obj.endDate;
    const startTime = obj.startTime;
    const location = obj.location;
    const incharge = obj.incharge;
    const clubName = obj.clubName;
    

    const user = new Event({
        title: title,
        category: category,
        discription: discription,
       startDate:startDate,
        endDate: endDate,
        startTime:startTime,
        location:location,
        eventIncharge:incharge,
        createdBy:clubName
    })
    user.save()
        .then(result =>{
            console.log('Event created successfully!');
            res.status(200).json({
                success:true,
                msg:"Event created successfully!"
            }).redirect('/');
            
        })
        .catch(err =>{
            console.log(err);
        })
}
exports.postFetchEvents = async(req,res,next) => {
    //console.log(req. body);
  
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);

    const clubName = obj.clubName;
    
    const events =  await Event.find({createdBy:clubName});
    // user.save()
    //     .then(result =>{
            // console.log('Event created successfully!');
            // res.status(200).json({
            //     events
            // }).redirect('/');
            
    //     })
    //     .catch(err =>{
    //         console.log(err);
    //     })
    if(events.length>0){
        console.log('Event find successfully!');
        res.status(200).json({
            events
        }).redirect('/');
    }else{
        res.status(400).json({
            success:false,
            msg:"Couldn't find event!"
        }).redirect('/');
    }
}
