import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {motion} from 'framer-motion'

export const StudentsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg p-4 shadow-sm flex items-center space-x-4"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Student {i + 1}</h3>
              <p className="text-sm text-muted-foreground">Enrolled in 2 courses</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )