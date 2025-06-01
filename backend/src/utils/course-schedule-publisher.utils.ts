import cron from 'node-cron'
import { CourseModel } from '../models/implements/course.model'

export const initializeCoursePublisher = () => {
    
    cron.schedule('0 0 * * *', async () => {  // 12 am every day
        try {
            const now = new Date();
            console.log('Checking scheduled courses at:', now.toISOString());
            
            const coursesToPublish = await CourseModel.find({
                isScheduled: true,
                publishDate: { $lte: now },
                isPublished: false
            }).select('title _id')

            if (coursesToPublish.length > 0) {
                console.log(`Found ${coursesToPublish.length} courses to publish`)
            }

            // Bulk write -
            if (coursesToPublish.length) {
                const bulkOperation = coursesToPublish.map(course => ({
                    updateOne: {
                        filter: { _id: course._id },
                        update: { 
                            $set: { isPublished: true },
                            $unset: { isScheduled: "" }
                        }
                    }
                }))
                
                await CourseModel.bulkWrite(bulkOperation)
                console.log(`Successfully published ${coursesToPublish.length} courses`)
            }
        } catch (error) {
            console.error('Error in course publisher:', error)
        }
    })
}
