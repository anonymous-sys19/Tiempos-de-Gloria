export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) return `hace ${years} año${years > 1 ? 's' : ''}`
    if (months > 0) return `hace ${months} mes${months > 1 ? 'es' : ''}`
    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `hace ${hours} h${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    return 'hace unos segundos'
}