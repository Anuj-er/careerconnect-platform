# Use OpenJDK 17 as base image
FROM eclipse-temurin:17-jdk

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

# Make the Maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port that the application runs on
EXPOSE 8080

# Set the active profile to production
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application  
CMD ["java", "-jar", "target/careerconnect-1.0.0-SNAPSHOT.jar"]