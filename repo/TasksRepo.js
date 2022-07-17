const Tasks = require("../Schema/Tasks");

//basic data of tasks account
const data = {
  //this data will change when fetch api
  tasks: {
    task1: {
      desciption: "Testing 1 of this really long note i just figure it out",
      isTimer: true,
      hours: 1,
      minutes: 0,
      seconds: 0,
      hoursRemain: 1,
      minutesRemain: 0,
      secondsRemain: 0,
    },
  },
  //this data will change when fetch api
  columns: {
    monday: { tasksToDo: [] },
    tuesday: { tasksToDo: [] },
    wednesday: { tasksToDo: [] },
    thursday: { tasksToDo: [] },
    friday: {
      tasksToDo: [],
    },
    satuday: { tasksToDo: [] },
    sunday: { tasksToDo: [] },
    store: { tasksToDo: [] },
  },
  columnsId: [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "satuday",
    "store",
  ],
};
//repository tasks
const TaskRepo = {
  modifiedData: function (data) {
    let modified = {};
    data.forEach((element) => {
      modified[element.name] = element.value;
    });
    return modified;
  },
  revertModifiedData: function (data) {
    let entries = Object.entries(data);
    return entries.map((element) => {
      return {
        name: element[0],
        value: element[1],
      };
    });
  },
  //return the id of the new task insert
  insertNewTasks: function (resolve, reject) {
    let day = new Date().getDay();
    //create copy of columns to avoid dublicate
    let copy = JSON.parse(JSON.stringify(data.columns));
    //trasnfer number to day
    day = data.columnsId[day];
    //add new example task to day
    copy[day].tasksToDo.push("task1");
    const task = new Tasks({
      lastUpdate: Date.now(),
      tasks: TaskRepo.revertModifiedData(data.tasks),
      columns: TaskRepo.revertModifiedData(copy),
      columnsId: data.columnsId,
    });
    task
      .save()
      .then((result) => {
        resolve(result._id);
      })
      .catch((err) => {
        reject(err);
      });
  },
};

module.exports = TaskRepo;
