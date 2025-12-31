import { getProfile } from './actions'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const user = await getProfile()

  if (!user) {
    return null // Handle error or redirect handled in action
  }

  return (
    <div className="container py-10">
      <ProfileForm user={user} />
    </div>
  )
}
