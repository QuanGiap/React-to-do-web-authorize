const router = require("express").Router();
const TaskRepo = require("../repo/TasksRepo")
require("dotenv").config();

router.get("/check", function (req, res, next) {
  res.json({ greet: "Hello express" });
});
router.post("/getTasks", function (req, res, next) {
  TaskRepo.getTasks(
    req.user.dataId,
    (data) => {
      res.json(data);
    },
    (err) => {
      next(err);
    }
  );
});
//return the id of the new data task inventory
router.post("/insert/new", function (req, res, next) {
  TasksRepo.insertNewTasks(
    (id) => { 
      res.json({ idTasks: id });
    },
    (err) => {
      next(err);
    }
  );
});

/* body look
{
    "hoursRemain":1,
    "minutesRemain":2,
    "secondsRemain":3,
    "nameTask":"task2"
} */
//usually called when user only change 1 value time in task
router.patch("/update", function (req, res, next) {
  if (
    req.user.dataId == undefined||
    req.body.hoursRemain == undefined ||
    req.body.minutesRemain == undefined ||
    req.body.secondsRemain == undefined ||
    req.body.nameTask == undefined
  ) {
    res.sendStatus(404);
    return;
  }
  let newData = {
    hoursRemain: req.body.hoursRemain,
    minutesRemain: req.body.minutesRemain,
    secondsRemain: req.body.secondsRemain,
  };

  TaskRepo.updateTasks(
    req.user.dataId,
    req.body.nameTask,
    newData,
    (data) => {
      res.json({ result: true });
    },
    (err) => next(err)
  );
},
);
//change value of the taskData, usually call when user edit taskid
router.patch("/updateAll", function (req, res, next) {
  if (
    !req.user.dataId ||
    !req.body.tasks ||
    !req.body.columns
    ) {
      res.sendStatus(404);
      return;
    }
    
    let newData = {
      tasks: req.body.tasks,
      columns: req.body.columns,
    };
    
    TaskRepo.updateAll(
    req.user.dataId,
    newData,
    (result) => {
      res.json({ result: result });
    },
    (err) => next(err)
  );
},
);
module.exports = router;
