const Event = require('../models/createEvent');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/auth')
const ParticipationList = require('../models/EventParticipationList')
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

exports.postCreateEvent = async(req,res,next) => {
    //console.log(req.body);
  
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
    const orgClub = obj.orgClub;
    const goodies = obj.goodies;
    const eliCriteria = obj.eliCriteria;
    const rules = obj.rules;
    const user = new Event({
        title: title,
        category: category,
        discription: discription,
        aboutOrganizingClub: orgClub,
        goodies: goodies,
        eliCriteria: eliCriteria,
        rules: rules,
       startDate:startDate,
        endDate: endDate,
        startTime:startTime,
        location:location,
        eventIncharge:incharge,
        createdBy:clubName
    })
    user.save()
        .then(result =>{
            const participationList = new ParticipationList({
                eventName:title,
                participatedStudents:[]
            })
            participationList.save()
            .then(re=>{
                console.log('Event created successfully!');
                res.status(200).json({
                    success:true,
                    msg:"Event created successfully!"
                });
            })
            
        })
        .catch(err =>{
            console.log(err);
        })
}
exports.fetchSingleEvent = async(req,res,next) =>{
    const obj = JSON.parse(JSON.stringify(req.body))
    const eveName = obj.eveName;

    const eveInfo = await Event.find({title: eveName});
      if(!eveInfo){
          return res.json({
              message: 'Event Doesnt Exist !'
          })
      }
    res.json({
        eveInfo
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
exports.setReminder = async(req,res,next) =>{
    const obj = JSON.parse(JSON.stringify(req.body));
    const userName = obj.name;
    const eveName = obj.eveName;
    const dateInString = obj.date;
    const email = obj.email
    const date = new Date(dateInString);
    const eveTime = date.getTime() / 1000;
    const currentDateTime = new Date();
    const currInSeconds=currentDateTime.getTime() / 1000;
    const timeOutTime = eveTime - currInSeconds;
    setTimeout(() => {
        transporter.sendMail({
            to: email,
            from: 'sahilmohammad532@gmail.com',
            subject: 'Signed Up',
            html: `
              <p>Hello ${userName}</p>
              <p>${eveName} is going to start at ${dateInString}</p>
            `
          });
    },timeOutTime);
    res.send('OK')
}
exports.participationList = async(req,res,next) =>{
    const obj = JSON.parse(JSON.stringify(req.body));
    const userId = obj.userId;
    const eventId = obj.eveId;
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if(user&&event){
        ParticipationList.findOne({eventName:event.title})
        .then(re=>{
           const li = re.participatedStudents;
           li.push({
               name:user.name,
               memberId:userId,
               branch:user.department
           })
           re.participatedStudents = li;
           re.save()
           .then(data=>{
                const pi = user.participatedEvents;
                pi.push({
                    eventId:eventId,
                    eventName:event.title
                })
                user.participatedEvents=pi;
                user.save()
                .then(se=>{
                    res.send('OK')
                })
               
           }).catch(err=>{
               console.log(err)
           })
        })
        .catch(err=>{
            res.status(404).json({msg:"Event not found !!!"})
        })
    }
    else{
        res.status(404).json({msg:"Event not found !!!"})
    }

}
exports.fetchParticipationList = async(req,res,next)=>{
    const obj = JSON.parse(JSON.stringify(req.body));
    const eventId = obj.eveId;
    const event = await Event.findById(eventId);
    const list = await ParticipationList.findOne({eventName:event.title});
    if(list){
        res.status(200).json(list);
    }else{
        res.status(404).json({msg:"Event not found !!!"});
    }
}
exports.addEventsToProfile = async(req,res,next)=>{
    const obj = JSON.parse(JSON.stringify(req.body));
    const date = obj.date;
    const eventId = obj._id;
    const eventName = obj.eventName;
    const list = obj.participatedStudents;
    // console.log(list)
    list.map(async (val)=>{
        const user = await User.findById(val.memberId);
        if(user){
            if(val.isAttend){
                const l = user.attendedEvents;
                l.push({
                    date:date,
                    eventId:eventId,
                    eventName:eventName
                })
                user.attendedEvents = l;
            }
        user.save()
        .then(re=>{
            clg('done')
        }).catch(err=>{
             res.status(404).json({msg:"User not found !!!"});
        })
        }
     
    })
    res.status(200).send("OK");
}