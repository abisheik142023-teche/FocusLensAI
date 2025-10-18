const mongoose = require('mongoose');
const { performanceSchema } = require('../models/Performance') ? {} : {}; // placeholder
const Employee = require('../models/Employee');
const Performance = require('../models/Performance');

class Database {
  constructor() {
    this._connect();
    this.Employee = Employee;
    this.Performance = Performance;
  }

  _connect() {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => console.log('Database connection successful (db.js)'))
      .catch(err => console.error('Database connection error (db.js):', err));
  }

  async createEmployee(data) {
    try {
      const e = new this.Employee(data);
      await e.save();
      return e;
    } catch (err) {
      throw new Error(`createEmployee: ${err.message}`);
    }
  }

  async getEmployeeById(id) {
    return this.Employee.findById(id).select('-password');
  }

  async getEmployeeByEmail(email) {
    return this.Employee.findOne({ email });
  }

  async updateEmployee(id, updateData) {
    if (updateData.password) {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return this.Employee.findByIdAndUpdate(id, updateData, { new: true });
  }

  async createPerformanceRecord(perf) {
    try {
      const r = new this.Performance(perf);
      await r.save();
      return r;
    } catch (err) {
      throw new Error(`createPerformanceRecord: ${err.message}`);
    }
  }

  async getEmployeePerformance(employeeId, days = 7) {
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.Performance.find({ employeeId, date: { $gte: dateThreshold } }).sort({ date: -1 });
  }

  async getTeamPerformance(team, days = 7) {
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const employees = await this.Employee.find({ team });
    return this.Performance.find({
      employeeId: { $in: employees.map(e => e._id) },
      date: { $gte: dateThreshold }
    }).populate('employeeId', 'name email');
  }

  async getProductivityTrends(employeeId, period = 'week') {
    let groupBy, dateFormat;
    if (period === 'day') {
      groupBy = { hour: { $hour: '$date' } };
      dateFormat = '%H:00';
    } else if (period === 'month') {
      groupBy = { day: { $dayOfMonth: '$date' } };
      dateFormat = '%d';
    } else {
      groupBy = { dayOfWeek: { $dayOfWeek: '$date' } };
      dateFormat = '%A';
    }

    return this.Performance.aggregate([
      { $match: { employeeId: mongoose.Types.ObjectId(employeeId) } },
      { $group: {
        _id: groupBy,
        avgProductivity: { $avg: '$productiveHours' },
        avgFocus: { $avg: '$focusPercentage' },
        date: { $first: '$date' }
      }},
      { $sort: { date: 1 } },
      { $project: {
        _id: 0,
        period: { $dateToString: { format: dateFormat, date: '$date' } },
        avgProductivity: 1,
        avgFocus: 1
      }}
    ]);
  }
}

module.exports = new Database();
