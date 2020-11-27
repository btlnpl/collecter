package main

import (
	"github.com/btlnpl/collecter/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func setupRoutes(app *fiber.App) {
	// give response when at /
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "You are at the endpoint 😉",
		})
	})

	// api group
	api := app.Group("/api")

	// give response when at /api
	api.Get("", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"success": true,
			"message": "You are at the api endpoint 😉",
		})
	})

	// send todos route group to TodoRoutes of routes package
	routes.TodoRoute(api.Group("/todos"))
}

func main() {
	app := fiber.New()
	app.Static("/","./")
	//app.Static("/", "./public")
	app.Use(logger.New())

	// setup routes
	setupRoutes(app)

	// Listen on server 8000 and catch error if any
	err := app.Listen(":8000")

	// handle error
	if err != nil {
		panic(err)
	}
}
