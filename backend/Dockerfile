# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17-slim AS build
COPY . /app
WORKDIR /app
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim
COPY --from=build /app/target/*.jar app.jar
# Render provides the port via an environment variable
EXPOSE 8080 
ENTRYPOINT ["java", "-jar", "/app.jar"]