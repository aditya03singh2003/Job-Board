"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export function DbInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCard, setShowCard] = useState(false)

  const initializeDb = async () => {
    setIsInitializing(true)
    setError(null)

    try {
      const response = await fetch("/api/init-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ force: false }),
      })

      const data = await response.json()

      if (data.success) {
        setIsInitialized(true)
        // Reload the page after successful initialization
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setError(data.error || "Failed to initialize database")
        setShowCard(true)
      }
    } catch (err) {
      setError("An error occurred while initializing the database")
      console.error(err)
      setShowCard(true)
    } finally {
      setIsInitializing(false)
    }
  }

  useEffect(() => {
    // Check if database is initialized
    async function checkDbStatus() {
      try {
        const response = await fetch("/api/check-db-status")
        const data = await response.json()

        if (data.initialized) {
          setIsInitialized(true)
        } else {
          setShowCard(true)
          // Auto-initialize on component mount
          initializeDb()
        }
      } catch (error) {
        console.error("Error checking database status:", error)
        setShowCard(true)
      }
    }

    checkDbStatus()
  }, [])

  if (isInitialized || !showCard) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            The database tables need to be initialized before you can use the job board.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <motion.div
              className="bg-red-50 text-red-800 p-3 rounded-md mb-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          <p className="text-sm text-muted-foreground mb-4">
            This will create the necessary tables and sample data in your database.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={initializeDb} disabled={isInitializing} className="w-full">
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
