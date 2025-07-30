import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const { FiCalendar, FiClock, FiUser, FiVideo, FiPhone, FiMapPin, FiPlus, FiEdit, FiStar } = FiIcons;

const Coaching = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);

  const coaches = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Software Engineer at Meta',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      sessions: 156,
      specialties: ['React', 'System Design', 'Career Growth'],
      hourlyRate: 120,
      availability: 'Available today'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      title: 'Product Manager at Google',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      sessions: 203,
      specialties: ['Product Strategy', 'Leadership', 'Interview Prep'],
      hourlyRate: 150,
      availability: 'Available tomorrow'
    },
    {
      id: 3,
      name: 'Emily Davis',
      title: 'Engineering Manager at Netflix',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5.0,
      sessions: 89,
      specialties: ['Team Management', 'Technical Leadership', 'Scaling'],
      hourlyRate: 180,
      availability: 'Available this week'
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      coach: 'Sarah Chen',
      date: 'Today, 2:00 PM',
      duration: '60 min',
      type: 'Video Call',
      topic: 'System Design Interview Prep',
      status: 'confirmed'
    },
    {
      id: 2,
      coach: 'Mike Rodriguez',
      date: 'Tomorrow, 10:00 AM',
      duration: '45 min',
      type: 'Phone Call',
      topic: 'Product Management Career Path',
      status: 'pending'
    },
    {
      id: 3,
      coach: 'Emily Davis',
      date: 'Friday, 3:00 PM',
      duration: '90 min',
      type: 'Video Call',
      topic: 'Leadership Skills Workshop',
      status: 'confirmed'
    }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coaching & Mentorship</h1>
          <p className="text-gray-600 mt-1">Book 1-on-1 sessions with industry experts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBookingModal(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Book Session</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar & Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <SafeIcon 
                        icon={session.type === 'Video Call' ? FiVideo : FiPhone} 
                        className="w-5 h-5 text-primary-600" 
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{session.topic}</h4>
                      <p className="text-sm text-gray-600">with {session.coach}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center space-x-1">
                          <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                          <span>{session.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="w-3 h-3" />
                          <span>{session.duration}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <SafeIcon icon={FiEdit} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Available Coaches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Coaches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coaches.map((coach) => (
                <div key={coach.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors">
                  <div className="flex items-start space-x-3">
                    <img
                      src={coach.avatar}
                      alt={coach.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{coach.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{coach.title}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <SafeIcon
                              key={i}
                              icon={FiStar}
                              className={`w-3 h-3 ${i < Math.floor(coach.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {coach.rating} ({coach.sessions} sessions)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {coach.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">${coach.hourlyRate}/hour</p>
                          <p className="text-xs text-green-600">{coach.availability}</p>
                        </div>
                        <button
                          onClick={() => setShowBookingModal(true)}
                          className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Calendar Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
          <div className="calendar-container">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full border-none"
            />
          </div>
          
          {/* Available Time Slots */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Available Times</h4>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className="p-2 text-sm border border-gray-200 rounded hover:border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">This Month</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sessions Booked</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hours Scheduled</span>
                <span className="font-medium">12.5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-medium">$1,850</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book a Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Coach</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Choose a coach...</option>
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.name} - ${coach.hourlyRate}/hour
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Video Call</option>
                  <option>Phone Call</option>
                  <option>In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>30 minutes</option>
                  <option>60 minutes</option>
                  <option>90 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic/Goals</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe what you'd like to focus on..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Book Session
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Coaching;