import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { StarIcon } from 'lucide-react'

export const ReviewsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                <AvatarFallback>RV</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Reviewer {i + 1}</h3>
                <p className="text-sm text-muted-foreground">2 days ago</p>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, starIndex) => (
                <StarIcon
                  key={starIndex}
                  className={`h-5 w-5 ${
                    starIndex < 4 ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">
            Great instructor! The course content was well-structured and easy to follow.
            I learned a lot and would definitely recommend this course to others.
          </p>
        </motion.div>
      ))}
    </motion.div>
  )