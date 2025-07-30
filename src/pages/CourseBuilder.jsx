import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiPlus, FiEdit, FiUsers, FiClock, FiPlay, FiLock, FiUnlock, FiDollarSign, FiStar } = FiIcons;

const CourseBuilder = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const courses = [
    {
      id: 1,
      title: 'Complete Guide to Tech Interviews',
      description: 'Master the art of technical interviews with comprehensive preparation strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
      instructor: 'Sarah Chen',
      students: 1247,
      lessons: 24,
      duration: '8 hours',
      price: 99,
      status: 'published',
      rating: 4.8,
      category: 'Interview Prep'
    },
    {
      id: 2,
      title: 'Building Your Personal Brand',
      description: 'Learn how to create and maintain a strong professional presence online.',
      thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=225&fit=crop',
      instructor: 'Mike Rodriguez',
      students: 892,
      lessons: 18,
      duration: '6 hours',
      price: 79,
      status: 'draft',
      rating: 4.6,
      category: 'Career Development'
    },
    {
      id: 3,
      title: 'Leadership in Tech',
      description: 'Develop essential leadership skills for technical roles and team management.',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
      instructor: 'Emily Davis',
      students: 634,
      lessons: 32,
      duration: '12 hours',
      price: 149,
      status: 'published',
      rating: 4.9,
      category: 'Leadership'
    }
  ];

  const dripContent = [
    {
      id: 1,
      title: 'Introduction to System Design',
      type: 'video',
      duration: '15 min',
      releaseDate: 'Available now',
      status: 'published'
    },
    {
      id: 2,
      title: 'Scalability Fundamentals',
      type: 'video',
      duration: '22 min',
      releaseDate: 'Day 3',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Database Design Patterns',
      type: 'article',
      duration: '10 min read',
      releaseDate: 'Day 7',
      status: 'scheduled'
    },
    {
      id: 4,
      title: 'Microservices Architecture',
      type: 'video',
      duration: '35 min',
      releaseDate: 'Day 10',
      status: 'draft'
    }
  ];

  const tabs = [
    { id: 'courses', name: 'My Courses', icon: FiBook },
    { id: 'create', name: 'Create Course', icon: FiPlus },
    { id: 'drip', name: 'Drip Content', icon: FiClock }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCourses = () => (
    <div className="space-y-6">
      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Courses', value: '12', icon: FiBook, color: 'blue' },
          { label: 'Total Students', value: '3,847', icon: FiUsers, color: 'green' },
          { label: 'Revenue', value: '$24,680', icon: FiDollarSign, color: 'purple' },
          { label: 'Avg Rating', value: '4.7', icon: FiStar, color: 'yellow' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
          >
            <div className={`w-12 h-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                {course.duration}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                  {course.category}
                </span>
                <span className="text-lg font-bold text-gray-900">${course.price}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center space-x-1">
                  <SafeIcon icon={FiUsers} className="w-4 h-4" />
                  <span>{course.students} students</span>
                </span>
                <span className="flex items-center space-x-1">
                  <SafeIcon icon={FiBook} className="w-4 h-4" />
                  <span>{course.lessons} lessons</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <SafeIcon
                        key={i}
                        icon={FiStar}
                        className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({course.rating})</span>
                </div>
                <button className="text-primary-600 hover:text-primary-700 transition-colors">
                  <SafeIcon icon={FiEdit} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCreateCourse = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Course</h3>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter course title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>Select category...</option>
              <option>Interview Prep</option>
              <option>Career Development</option>
              <option>Leadership</option>
              <option>Technical Skills</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
          <textarea
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe what students will learn..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="99"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="8 hours"
            />
          </div>
        </div>

        {/* Course Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <SafeIcon icon={FiPlus} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Upload course thumbnail (1280x720 recommended)</p>
            <button className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Choose File
            </button>
          </div>
        </div>

        {/* Course Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Course Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="text-primary-600 focus:ring-primary-500 rounded" />
              <span className="text-sm text-gray-700">Enable drip content</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="text-primary-600 focus:ring-primary-500 rounded" />
              <span className="text-sm text-gray-700">Require enrollment approval</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="text-primary-600 focus:ring-primary-500 rounded" />
              <span className="text-sm text-gray-700">Issue completion certificates</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="text-primary-600 focus:ring-primary-500 rounded" />
              <span className="text-sm text-gray-700">Enable discussion forums</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Save as Draft
          </button>
          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Create Course
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderDripContent = () => (
    <div className="space-y-6">
      {/* Drip Content Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Drip Content Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Release Schedule</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>Daily</option>
              <option>Every 2 days</option>
              <option>Weekly</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>UTC</option>
              <option>PST</option>
              <option>EST</option>
              <option>GMT</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Content Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Content Timeline</h3>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Content</span>
          </button>
        </div>

        <div className="space-y-4">
          {dripContent.map((content, index) => (
            <div key={content.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  content.status === 'published' ? 'bg-green-100' : 
                  content.status === 'scheduled' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <SafeIcon 
                    icon={content.status === 'published' ? FiUnlock : FiLock} 
                    className={`w-4 h-4 ${
                      content.status === 'published' ? 'text-green-600' : 
                      content.status === 'scheduled' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{content.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={content.type === 'video' ? FiPlay : FiBook} className="w-3 h-3" />
                    <span>{content.type}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiClock} className="w-3 h-3" />
                    <span>{content.duration}</span>
                  </span>
                  <span>{content.releaseDate}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                  {content.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Builder</h1>
        <p className="text-gray-600 mt-1">Create and manage educational content with drip scheduling</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'create' && renderCreateCourse()}
        {activeTab === 'drip' && renderDripContent()}
      </div>
    </div>
  );
};

export default CourseBuilder;