// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//Routes 
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointment");