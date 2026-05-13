# Stage 1: Build the application
# We use Maven with the Temurin JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
COPY . /app
WORKDIR /app
RUN mvn clean package -DskipTests

# Stage 2: Run the application
# We use the smaller JRE (Runtime) image for the final container
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render needs the app to listen on the $PORT environment variable
EXPOSE 8080 
ENTRYPOINT ["java", "-jar", "app.jar"]