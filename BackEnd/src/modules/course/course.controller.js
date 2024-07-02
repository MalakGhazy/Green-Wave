import Course from '../../../DB/model/course.model.js';

// 1] Add Course
export const addCourse = async (req, res) => {
    try {
        const { title, description, duration, price, instructor, category, image, createdBy } = req.body;
        const course = new Course({ title, description, duration, price, instructor, category, image, createdBy });
        await course.save();
        res.status(201).json({ message: 'Course added successfully', course });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2] Update Course
export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, duration, price, instructor, category, image, rating } = req.body;
        const course = await Course.findByIdAndUpdate(
            courseId,
            { title, description, duration, price, instructor, category, image, rating },
            { new: true }
        );
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3] Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4] Search Course
export const searchCourse = async (req, res) => {
    try {
        const { query } = req.query;
        const courses = await Course.find({ title: { $regex: query, $options: 'i' } });
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5] Get Course By Id
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 6] Get All Courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
